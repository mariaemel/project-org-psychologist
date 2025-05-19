from django.db import models


CLIENT_TYPE_CHOICES = [
    ('individual', 'Физическое лицо'),
    ('organization', 'Юридическое лицо'),
]


QUESTION_STATUS_CHOICES = [
    ('новый', 'Новый'),
    ('прочитан', 'Прочитан'),
    ('отвечен', 'Отвечен'),
]

class ClientQuestion(models.Model):
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    question_text = models.TextField(verbose_name='Текст вопроса (Описание ситуации)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')
    status = models.CharField(
        max_length=50,
        default='новый',
        choices=QUESTION_STATUS_CHOICES,
        verbose_name='Статус'
    )
    answer = models.TextField(blank=True, null=True, verbose_name='Ответ специалиста')
    answered_at = models.DateTimeField(blank=True, null=True, verbose_name='Дата и время ответа')

    client_type = models.CharField(
        max_length=50,
        choices=CLIENT_TYPE_CHOICES,
        verbose_name='Тип клиента',
        default = 'individual'
    )
    full_name = models.CharField(max_length=255, verbose_name='ФИО')
    question_topic = models.CharField(max_length=255, verbose_name='Тема вопроса')

    position_juridical = models.CharField(max_length=255, blank=True, null=True, verbose_name='Должность (юр. лица)')
    company_name_juridical = models.CharField(max_length=255, blank=True, null=True, verbose_name='Название компании (юр. лица)')
    inn_juridical = models.CharField(max_length=255, blank=True, null=True, verbose_name='ИНН (юр. лица)')
    preferred_communication = models.CharField(max_length=255, verbose_name='Предпочитаемый способ связи')

    additional_files = models.FileField(upload_to='question_files/', blank=True, null=True, verbose_name='Дополнительные файлы')
    consent_processing = models.BooleanField(default=False, verbose_name='Согласие на обработку персональных данных')

    def __str__(self):
        return f'Вопрос от {self.full_name or self.phone} ({self.created_at.strftime("%Y-%m-%d %H:%M")})'

    class Meta:
        verbose_name = 'Вопрос клиента'
        verbose_name_plural = 'Вопросы клиентов'
        ordering = ['-created_at']
