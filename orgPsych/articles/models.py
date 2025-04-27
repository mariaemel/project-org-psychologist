from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    short_description = models.TextField(verbose_name='Краткое описание')
    content = models.TextField(verbose_name='Полный текст')
    published_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')
    is_published = models.BooleanField(default=False, verbose_name='Опубликовано')
    tags = models.CharField(max_length=255, blank=True, verbose_name='Теги')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'
        ordering = ['-published_date']