from django.db import models

def homepage_image_path(instance, filename):
    obj_id = instance.id or 'new'
    return f'homepage/{obj_id}/{filename}'

class HomePage(models.Model):
    title = models.CharField('Название', max_length=255)
    content = models.TextField('Содержимое')
    image = models.ImageField('Картинка', upload_to=homepage_image_path, blank=True, null=True)

    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Главная страница'
        verbose_name_plural = 'Главная страница'
        ordering = ['-updated_at']

    def __str__(self):
        return self.title
