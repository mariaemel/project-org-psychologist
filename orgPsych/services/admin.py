from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'client_type', 'price', 'is_active')
    list_filter = ('client_type', 'is_active')
    search_fields = ('name', 'description')
    ordering = ['client_type', 'name']
