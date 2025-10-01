from django.db import models

class FAQ(models.Model):
    question = models.CharField("Вопрос", max_length=255)
    answer = models.TextField("Ответ")

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Вопрос-ответ"
        verbose_name_plural = "Часто задаваемые вопросы"
        ordering = ["created_at"]

    def __str__(self):
        return self.question
