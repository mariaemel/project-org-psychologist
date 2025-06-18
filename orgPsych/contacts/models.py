from django.db import models

class Contact(models.Model):
    email = models.EmailField(verbose_name='Email')
    phone = models.CharField(max_length=30, verbose_name='Телефон')
    telegram = models.CharField(max_length=100, verbose_name='Telegram')

    def __str__(self):
        return f'Контакты: {self.email} / {self.phone} / {self.telegram}'

    class Meta:
        verbose_name = 'Контакт'
        verbose_name_plural = 'Контакты'
