from django.contrib import admin
from .models import SpecialistInfo

@admin.register(SpecialistInfo)
class SpecialistInfoAdmin(admin.ModelAdmin):
    list_display = ('full_name',)
    search_fields = ('full_name', 'education', 'experience')
