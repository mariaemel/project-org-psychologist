# app/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import SpecialistInfo, ImageAsset

@admin.register(SpecialistInfo)
class SpecialistInfoAdmin(admin.ModelAdmin):
    list_display = ("name", "short_content", "updated_at")
    search_fields = ("name", "content")
    list_per_page = 25

    def short_content(self, obj):
        return (obj.content[:60] + "…") if len(obj.content) > 60 else obj.content
    short_content.short_description = "Содержимое (кратко)"


@admin.register(ImageAsset)
class ImageAssetAdmin(admin.ModelAdmin):
    list_display = ("name", "thumbnail", "created_at")
    search_fields = ("name",)
    readonly_fields = ("preview",)
    fields = ("name", "image", "preview", "created_at")
    readonly_fields = ("created_at", "preview")

    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;" />', obj.image.url)
        return "—"
    thumbnail.short_description = "Превью"

    def preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" style="max-width:400px; height:auto;" />', obj.image.url)
        return "Нет изображения"
    preview.short_description = "Предпросмотр"
