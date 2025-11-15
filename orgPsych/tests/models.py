from __future__ import annotations

import uuid
from django.db import models
from django.core.validators import MinValueValidator
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
        default=5,
        validators=[MinValueValidator(1)],
        help_text="Оценочное время прохождения в минутах"
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
        SCALE = "scale", "Шкала / числовой балл"
        TEXT = "text", "Свободный ввод"

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="questions",
        help_text="К какому тесту относится вопрос"
    )

    order_index = models.PositiveIntegerField(
        help_text="Порядок вопроса в тесте (1..N). "
                  "Используется для прогресса 'вопрос n из m'"
    )

    text = models.TextField(
        help_text="Формулировка ситуации / вопроса / утверждения"
    )

    type = models.CharField(
        max_length=16,
        choices=Types.choices,
        help_text="Тип вопроса: single / multiple / scale / text"
    )

    required = models.BooleanField(
        default=True,
        help_text="Нужно ли обязательно ответить на этот вопрос, чтобы завершить тест"
    )

    help_text = models.TextField(
        blank=True,
        help_text="Доп. подсказка пользователю (например: 'оцените КАЖДЫЙ вариант от 0 до 9')"
    )

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
        Question,
        on_delete=models.CASCADE,
        related_name="options",
        help_text="К какому вопросу относится этот вариант"
    )

    order_index = models.PositiveIntegerField(
        help_text="Порядок показа варианта внутри вопроса"
    )

    text = models.TextField(
        help_text="Текст варианта, который видит пользователь"
    )

    value = models.CharField(
        max_length=64,
        blank=True,
        help_text="Машинный код варианта (например TELL_SOLUTION)"
    )

    dimension_code = models.CharField(
        max_length=64,
        blank=True,
        help_text="К какой шкале относится этот вариант (A/B/C/D, STABILITY, D, ...)"
    )

    weights_json = models.JSONField(
        blank=True,
        default=dict,
        help_text="JSON с весами по шкалам для линейного подсчёта (например DISC)"
    )

    class Meta:
        ordering = ["question_id", "order_index", "id"]
        unique_together = [("question", "order_index")]
        indexes = [
            models.Index(fields=["question", "order_index"]),
            models.Index(fields=["value"]),
            models.Index(fields=["dimension_code"]),
        ]

    def __str__(self) -> str:
        dim = f" [{self.dimension_code}]" if self.dimension_code else ""
        return f"Opt Q{self.question.order_index}#{self.order_index}{dim}"


class ScoringRule(TimeStampedModel):
    class RuleType(models.TextChoices):
        LINEAR = "linear_weights", "Линейные веса"
        DIM_SUM = "sum_by_dimension_code", "Сумма по шкалам (dimension_code)"
        LOOKUP = "lookup_table", "Таблица соответствий"
        FORMULA = "formula", "Формула"

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="scoring_rules",
        help_text="Какой тест использует это правило"
    )

    rule_type = models.CharField(
        max_length=32,
        choices=RuleType.choices,
        help_text="Как считать итог для этого теста"
    )

    rule_payload_json = models.JSONField(
        default=dict,
        blank=True,
        help_text=(
            "Параметры для расчёта и интерпретации: "
            "названия шкал, уровни, пороги и т.д. "
            "Напр: {'dimension_titles':{'A':'Информирование',...}, "
            "'levels':[{'code':'high','range':[67,999]}], ...}"
        )
    )

    class Meta:
        ordering = ["test_id", "id"]
        indexes = [
            models.Index(fields=["test", "rule_type"]),
        ]

    def __str__(self) -> str:
        return f"[{self.test.slug}] rule={self.rule_type}"


class Attempt(TimeStampedModel):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "В процессе"
        COMPLETED = "completed", "Завершено"
        ABORTED = "aborted", "Прервано"

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="attempts",
        help_text="Какой тест сейчас проходит пользователь"
    )

    started_at = models.DateTimeField(
        default=timezone.now,
        help_text="Когда пользователь начал попытку"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Когда последний раз были изменения в попытке"
    )

    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.IN_PROGRESS,
        help_text="Текущий статус попытки"
    )

    client_fingerprint_hash = models.CharField(
        max_length=128,
        blank=True,
        db_index=True,
        help_text="Хэш браузера/устройства (без ПДн)"
    )

    progress_index = models.IntegerField(
        default=0,
        help_text="Последний полностью сохранённый вопрос (1..N)"
    )

    autosave_ts = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Когда в последний раз делали автосохранение"
    )

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
        Attempt,
        on_delete=models.CASCADE,
        related_name="answers",
        help_text="К какой попытке относится ответ"
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="answers",
        help_text="На какой вопрос даётся этот кусок ответа"
    )

    option_single = models.ForeignKey(
        "Option",
        on_delete=models.CASCADE,
        related_name="answers_single",
        help_text="Какой вариант оценивается / выбран",
        null=True,
        blank=True,
    )

    option_ids = models.JSONField(
        default=list,
        blank=True,
        help_text="Список ID выбранных вариантов для multiple choice вопросов"
    )

    text_value = models.TextField(
        blank=True,
        help_text="Значение ответа пользователя (балл 0..9, текст и т.д.)"
    )

    saved_at = models.DateTimeField(
        default=timezone.now,
        help_text="Когда конкретно этот ответ был сохранён"
    )

    class Meta:
        ordering = ["attempt_id", "question_id", "option_single_id"]
        unique_together = [("attempt", "question", "option_single")]
        indexes = [
            models.Index(fields=["attempt", "question"]),
            models.Index(fields=["saved_at"]),
        ]

    def __str__(self) -> str:
        return f"Ans attempt={self.attempt_id} q={self.question_id} opt={self.option_single_id}"

    def clean(self):
        qtype = self.question.type

        if qtype == Question.Types.SINGLE:
            return

        if qtype == Question.Types.MULTIPLE:
            return

        if qtype == Question.Types.SCALE:
            return

        if qtype == Question.Types.TEXT:
            return


class Result(TimeStampedModel):
    attempt = models.OneToOneField(
        Attempt,
        on_delete=models.CASCADE,
        related_name="result",
        help_text="К какой попытке относится этот итог"
    )

    summary_md = models.TextField(
        blank=True,
        help_text="Текстовый вывод: ведущий стиль/якорь и краткое объяснение"
    )

    raw_json = models.JSONField(
        default=dict,
        blank=True,
        help_text="Сырые данные расчёта, чтобы можно было построить диаграмму и восстановить историю"
    )

    computed_at = models.DateTimeField(
        default=timezone.now,
        help_text="Когда мы посчитали результат"
    )

    class Meta:
        ordering = ["-computed_at"]
        indexes = [
            models.Index(fields=["computed_at"]),
        ]

    def __str__(self) -> str:
        return f"Result attempt={self.attempt_id}"


class ResultDimension(TimeStampedModel):
    result = models.ForeignKey(
        Result,
        on_delete=models.CASCADE,
        related_name="dimensions",
        help_text="К какому результату относится эта шкала"
    )

    code = models.CharField(
        max_length=64,
        help_text="Код шкалы (например 'D', 'A', 'STABILITY', 'ENTREPRENEURSHIP')"
    )

    title = models.CharField(
        max_length=200,
        help_text="Человекочитаемое имя шкалы (например 'Dominance', 'Поддержка', 'Стабильность')"
    )

    score = models.FloatField(
        help_text="Числовое значение по этой шкале (сырое или нормированное)"
    )

    level = models.CharField(
        max_length=50,
        blank=True,
        help_text="Словесный уровень: 'низкий', 'средний', 'высокий' или пусто"
    )

    explanation_md = models.TextField(
        blank=True,
        help_text="Объяснение результата по этой шкале (Markdown)"
    )

    class Meta:
        ordering = ["result_id", "id"]
        unique_together = [("result", "code")]
        indexes = [
            models.Index(fields=["result"]),
            models.Index(fields=["code"]),
        ]

    def __str__(self) -> str:
        return f"{self.result_id}:{self.code}={self.score}"


class ShareLink(TimeStampedModel):

    attempt = models.OneToOneField(
        Attempt,
        on_delete=models.CASCADE,
        related_name="share_link",
        help_text="Чья попытка доступна по этой ссылке"
    )

    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        help_text="Токен публичного доступа /results/<uuid>"
    )

    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Когда ссылка была создана"
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Если false — ссылка отозвана, результат больше не доступен публично"
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["uuid"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self) -> str:
        return f"ShareLink {self.uuid} (active={self.is_active})"