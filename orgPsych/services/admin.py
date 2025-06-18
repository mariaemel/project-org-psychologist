from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'client_type', 'category', 'price', 'duration', 'is_active')
    list_filter = ('client_type', 'category', 'is_active')
    search_fields = ('name', 'description', 'price', 'duration')
    ordering = ['client_type', 'category', 'name']
