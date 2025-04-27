from django.db import models

class ServiceCategory(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название категории')
    client_type = models.CharField(
        max_length=50,
        choices=[
            ('individual', 'Физическое лицо'),
            ('business', 'Бизнес'),
            ('organization', 'Организация'),
        ],
        verbose_name='Тип клиента'
    )
    order = models.IntegerField(default=0, verbose_name='Порядок отображения')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория услуг'
        verbose_name_plural = 'Категории услуг'
        ordering = ['order']

class Service(models.Model):
    category = models.ForeignKey(ServiceCategory, related_name='services', on_delete=models.CASCADE, verbose_name='Категория')
    name = models.CharField(max_length=255, verbose_name='Название услуги')
    description = models.TextField(verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Стоимость')
    is_active = models.BooleanField(default=True, verbose_name='Активна')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'