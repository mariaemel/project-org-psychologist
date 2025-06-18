from django.db import models

ARTICLE_TYPE_CHOICES = [
    ('article', 'Статья'),
    ('bookshelf', 'Книжная полка'),
]

BOOKSHELF_CATEGORIES = [
    ('finance', 'Управление финансами'),
    ('time', 'Тайм менеджмент'),
    ('self', 'Самодиагностика и управление состоянием'),
]

class Article(models.Model):
    type = models.CharField(
        max_length=20,
        choices=ARTICLE_TYPE_CHOICES,
        default='article',
        verbose_name='Тип материала'
    )
    category = models.CharField(
        max_length=50,
        choices=BOOKSHELF_CATEGORIES,
        blank=True,
        null=True,
        verbose_name='Категория (для книжной полки)'
    )
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    short_description = models.TextField(blank=True, verbose_name='Краткое описание')
    content = models.TextField(verbose_name='Полный текст')
    published_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')
    is_published = models.BooleanField(default=False, verbose_name='Опубликовано')
    tags = models.CharField(max_length=255, blank=True, verbose_name='Теги')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'
        ordering = ['-published_date']
