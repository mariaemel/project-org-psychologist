from django.contrib import admin
from django.utils.html import format_html
from .models import HomePage

@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at', 'thumb')
    search_fields = ('title', 'content')
    fields = ('title', 'content', 'image', 'preview', 'created_at', 'updated_at')
    readonly_fields = ('preview', 'created_at', 'updated_at')

    def thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;"/>', obj.image.url)
        return '—'
    thumb.short_description = 'Превью'

    def preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-width:400px;height:auto;"/>', obj.image.url)
        return 'Нет изображения'
    preview.short_description = 'Предпросмотр'
