from django.db import models

class ClientRequest(models.Model):
    full_name = models.CharField(max_length=255, verbose_name='ФИО')
    company = models.CharField(max_length=255, blank=True, null=True, verbose_name='Компания')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    request_text = models.TextField(verbose_name='Текст заявки')
    client_type = models.CharField(
        max_length=50,
        choices=[
            ('individual', 'Физическое лицо'),
            ('business', 'Бизнес'),
            ('organization', 'Организация'),
        ],
        verbose_name='Тип клиента'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время отправки')
    status = models.CharField(
        max_length=50,
        default='новая',
        choices=[
            ('новая', 'Новая'),
            ('в работе', 'В работе'),
            ('обработана', 'Обработана'),
            ('отклонена', 'Отклонена'),
        ],
        verbose_name='Статус'
    )

    def __str__(self):
        return f'Заявка от {self.full_name} ({self.created_at})'

    class Meta:
        verbose_name = 'Заявка клиента'
        verbose_name_plural = 'Заявки клиентов'
        ordering = ['-created_at']