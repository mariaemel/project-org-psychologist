from django.db import models


CLIENT_TYPE_CHOICES = [
    ('individual', 'Физическое лицо'),
    ('organization', 'Юридическое лицо'),
]


REQUEST_STATUS_CHOICES = [
    ('новая', 'Новая'),
    ('в работе', 'В работе'),
    ('обработана', 'Обработана'),
    ('отклонена', 'Отклонена'),
]

class ClientRequest(models.Model):
    full_name = models.CharField(max_length=255, verbose_name='ФИО')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    request_text = models.TextField(verbose_name='Текст заявки')
    client_type = models.CharField(
        max_length=50,
        choices=CLIENT_TYPE_CHOICES,
        verbose_name='Тип клиента'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время отправки')
    status = models.CharField(
        max_length=50,
        default='новая',
        choices=REQUEST_STATUS_CHOICES,
        verbose_name='Статус'
    )

    position_juridical = models.CharField(max_length=255, blank=True, null=True, verbose_name='Должность (юр. лица)')
    company_name_juridical = models.CharField(max_length=255, blank=True, null=True, verbose_name='Название компании (юр. лица)')
    inn_juridical = models.CharField(max_length=255, blank=True, null=True, verbose_name='ИНН (юр. лица)')
    preferred_communication = models.CharField(max_length=255, verbose_name='Предпочитаемый способ связи')

    selected_service = models.ForeignKey(
        'services.Service',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Выбранная услуга'
    )

    position_individual = models.CharField(max_length=255, blank=True, null=True, verbose_name='Должность (физ. лица)')
    desired_datetime = models.DateTimeField(blank=True, null=True, verbose_name='Желаемые дата и время консультации')
    additional_files = models.FileField(upload_to='request_files/', blank=True, null=True, verbose_name='Дополнительные файлы')
    consent_processing = models.BooleanField(default=False, verbose_name='Согласие на обработку персональных данных')

    def __str__(self):
        return f'Заявка от {self.full_name} ({self.created_at.strftime("%Y-%m-%d %H:%M")})'

    class Meta:
        verbose_name = 'Заявка клиента'
        verbose_name_plural = 'Заявки клиентов'
        ordering = ['-created_at']
