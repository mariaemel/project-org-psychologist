from django import forms
from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'category', 'published_date', 'is_published')
    list_filter = ('type', 'category', 'is_published')
    search_fields = ('title', 'content', 'tags')
    ordering = ['-published_date']
