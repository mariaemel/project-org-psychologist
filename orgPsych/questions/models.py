from django.db import models

class ClientQuestion(models.Model):
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    question_text = models.TextField(verbose_name='Текст вопроса')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')
    status = models.CharField(
        max_length=50,
        default='новый',
        choices=[
            ('новый', 'Новый'),
            ('прочитан', 'Прочитан'),
            ('отвечен', 'Отвечен'),
        ],
        verbose_name='Статус'
    )
    answer = models.TextField(blank=True, null=True, verbose_name='Ответ специалиста')
    answered_at = models.DateTimeField(blank=True, null=True, verbose_name='Дата и время ответа')

    def __str__(self):
        return f'Вопрос от {self.phone} ({self.created_at})'

    class Meta:
        verbose_name = 'Вопрос клиента'
        verbose_name_plural = 'Вопросы клиентов'
        ordering = ['-created_at']