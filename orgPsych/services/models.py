from django.db import models

CLIENT_TYPE_CHOICES = [
    ('individual', 'Физическое лицо'),
    ('organization', 'Юридическое лицо'),
]

CATEGORY_CHOICES = [
    ('consulting', 'Консультирование'),
    ('career', 'Карьерное консультирование'),
    ('other', 'Другие услуги'),
]

class Service(models.Model):
    client_type = models.CharField(
        max_length=50,
        choices=CLIENT_TYPE_CHOICES,
        verbose_name='Тип клиента'
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        verbose_name='Категория услуги'
    )
    name = models.CharField(max_length=255, verbose_name='Название услуги')
    description = models.TextField(verbose_name='Описание')
    price = models.CharField(max_length=100, verbose_name='Стоимость')
    duration = models.CharField(max_length=100, verbose_name='Продолжительность')
    is_active = models.BooleanField(default=True, verbose_name='Активна')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['client_type', 'category', 'name']
