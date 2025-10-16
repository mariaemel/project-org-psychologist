from __future__ import annotations

import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxLengthValidator
from django.utils import timezone


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Test(TimeStampedModel):
    slug = models.SlugField(unique=True, max_length=100)
    title = models.CharField(max_length=200)
    short_description = models.TextField(blank=True)
    instructions_md = models.TextField(blank=True)
    est_minutes = models.PositiveIntegerField(
        default=5, validators=[MinValueValidator(1)]
    )
    hero_image_url = models.URLField(blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    og_image_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]
        indexes = [
            models.Index(fields=["is_published"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.slug})"


class Question(TimeStampedModel):
    class Types(models.TextChoices):
        SINGLE = "single", "Одиночный выбор"
        MULTIPLE = "multiple", "Множественный выбор"
        SCALE = "scale", "Шкала / числовой"
        TEXT = "text", "Свободный ввод"

    test = models.ForeignKey(
        Test, on_delete=models.CASCADE, related_name="questions"
    )
    order_index = models.PositiveIntegerField()  # 1..N
    text = models.TextField()
    type = models.CharField(max_length=16, choices=Types.choices)
    required = models.BooleanField(default=True)

    class Meta:
        ordering = ["test_id", "order_index", "id"]
        unique_together = [("test", "order_index")]
        indexes = [
            models.Index(fields=["test", "order_index"]),
            models.Index(fields=["test"]),
        ]

    def __str__(self) -> str:
        return f"[{self.test.slug}] Q{self.order_index}: {self.text[:60]}..."


class Option(TimeStampedModel):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )
    order_index = models.PositiveIntegerField()
    text = models.TextField()
    value = models.CharField(max_length=64, blank=True)
    weights_json = models.JSONField(blank=True, default=dict)

    class Meta:
        ordering = ["question_id", "order_index", "id"]
        unique_together = [("question", "order_index")]
        indexes = [
            models.Index(fields=["question", "order_index"]),
            models.Index(fields=["value"]),
        ]

    def __str__(self) -> str:
        v = f" ({self.value})" if self.value else ""
        return f"Opt Q{self.question.order_index}#{self.order_index}{v}"


class ScoringRule(TimeStampedModel):
    class RuleType(models.TextChoices):
        LINEAR = "linear_weights", "Линейные веса"
        LOOKUP = "lookup_table", "Таблица соответствий"
        FORMULA = "formula", "Формула"

    test = models.ForeignKey(
        Test, on_delete=models.CASCADE, related_name="scoring_rules"
    )
    rule_type = models.CharField(max_length=32, choices=RuleType.choices)
    rule_payload_json = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["test_id", "id"]
        indexes = [models.Index(fields=["test", "rule_type"])]

    def __str__(self) -> str:
        return f"[{self.test.slug}] rule={self.rule_type}"


class Attempt(TimeStampedModel):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "В процессе"
        COMPLETED = "completed", "Завершено"
        ABORTED = "aborted", "Прервано"

    test = models.ForeignKey(
        Test, on_delete=models.CASCADE, related_name="attempts"
    )
    started_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.IN_PROGRESS
    )
    client_fingerprint_hash = models.CharField(
        max_length=128, blank=True, db_index=True
    )
    progress_index = models.IntegerField(default=0)
    autosave_ts = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["test", "status"]),
            models.Index(fields=["started_at"]),
        ]

    def __str__(self) -> str:
        return f"Attempt#{self.id} [{self.test.slug}] {self.status}"


class Answer(TimeStampedModel):
    attempt = models.ForeignKey(
        Attempt, on_delete=models.CASCADE, related_name="answers"
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    option_single = models.ForeignKey(
        "Option",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="answers_single",
    )
    option_ids = models.JSONField(blank=True, default=list)
    text_value = models.TextField(blank=True)
    saved_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["attempt_id", "question_id"]
        unique_together = [("attempt", "question")]
        indexes = [
            models.Index(fields=["attempt", "question"]),
            models.Index(fields=["saved_at"]),
        ]

    def __str__(self) -> str:
        return f"Ans attempt={self.attempt_id} q={self.question_id}"

    def clean(self):
        qtype = self.question.type
        if qtype == Question.Types.SINGLE:
            if not self.option_single or self.option_ids or self.text_value:
                from django.core.exceptions import ValidationError
                raise ValidationError("Для SINGLE используйте только option_single.")
            if self.option_single.question_id != self.question_id:
                from django.core.exceptions import ValidationError
                raise ValidationError("Выбранная опция не принадлежит вопросу.")
        elif qtype == Question.Types.MULTIPLE:
            if not isinstance(self.option_ids, list):
                from django.core.exceptions import ValidationError
                raise ValidationError("Для MULTIPLE option_ids должен быть списком id.")
            if self.option_single or self.text_value:
                from django.core.exceptions import ValidationError
                raise ValidationError("Для MULTIPLE используйте только option_ids.")
        elif qtype in (Question.Types.TEXT, Question.Types.SCALE):
            if self.option_single or self.option_ids:
                from django.core.exceptions import ValidationError
                raise ValidationError("Для TEXT/SCALE используйте только text_value.")


class Result(TimeStampedModel):
    attempt = models.OneToOneField(
        Attempt, on_delete=models.CASCADE, related_name="result"
    )
    summary_md = models.TextField(blank=True)
    raw_json = models.JSONField(default=dict, blank=True)
    computed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-computed_at"]
        indexes = [models.Index(fields=["computed_at"])]

    def __str__(self) -> str:
        return f"Result attempt={self.attempt_id}"


class ResultDimension(TimeStampedModel):
    result = models.ForeignKey(
        Result, on_delete=models.CASCADE, related_name="dimensions"
    )
    code = models.CharField(max_length=32)
    title = models.CharField(max_length=100)
    score = models.FloatField()
    level = models.CharField(max_length=50)
    explanation_md = models.TextField(blank=True)

    class Meta:
        ordering = ["result_id", "id"]
        indexes = [
            models.Index(fields=["result"]),
            models.Index(fields=["code"]),
        ]
        unique_together = [("result", "code")]

    def __str__(self) -> str:
        return f"{self.result_id}:{self.code}={self.score}"


class ShareLink(TimeStampedModel):
    attempt = models.OneToOneField(
        Attempt, on_delete=models.CASCADE, related_name="share_link"
    )
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["uuid"]), models.Index(fields=["is_active"])]

    def __str__(self) -> str:
        return f"ShareLink {self.uuid} (active={self.is_active})"
