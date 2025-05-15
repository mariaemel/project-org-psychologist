from django.db import models

CLIENT_TYPE_CHOICES = [
    ('individual', 'Физическое лицо'),
    ('organization', 'Юридическое лицо'),
]

class Service(models.Model):
    client_type = models.CharField(
        max_length=50,
        choices=CLIENT_TYPE_CHOICES,
        verbose_name='Тип клиента'
    )
    name = models.CharField(max_length=255, verbose_name='Название услуги')
    description = models.TextField(verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Стоимость')
    is_active = models.BooleanField(default=True, verbose_name='Активна')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['client_type', 'name']
