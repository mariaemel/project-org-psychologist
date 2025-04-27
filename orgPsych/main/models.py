from django.db import models

class SpecialistInfo(models.Model):
    photo = models.ImageField(upload_to='specialist_photos/', blank=True, null=True, verbose_name='Фотография специалиста')
    full_name = models.CharField(max_length=255, verbose_name='ФИО')
    experience = models.TextField(verbose_name='Опыт работы')
    education = models.TextField(verbose_name='Места обучения')
    social_links = models.JSONField(default=dict, blank=True, verbose_name='Ссылки на соцсети')
    entrepreneur_info = models.CharField(max_length=255, blank=True, null=True, verbose_name='Информация об ИП')
    requisites = models.TextField(blank=True, null=True, verbose_name='Реквизиты')

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = 'Информация о специалисте'
        verbose_name_plural = 'Информация о специалистах'