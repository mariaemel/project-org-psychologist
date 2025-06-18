from django.contrib import admin
from django import forms
from .models import Service, CATEGORY_CHOICES_INDIVIDUAL, CATEGORY_CHOICES_ORGANIZATION

class ServiceAdminForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = kwargs.get('instance')

        if instance:
            if instance.client_type == 'individual':
                self.fields['category'].widget = forms.Select(choices=CATEGORY_CHOICES_INDIVIDUAL)
            elif instance.client_type == 'organization':
                self.fields['category'].widget = forms.Select(choices=CATEGORY_CHOICES_ORGANIZATION)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm
    list_display = ('name', 'client_type', 'category', 'price', 'duration', 'is_active')
    list_filter = ('client_type', 'category', 'is_active')
    search_fields = ('name', 'description', 'price', 'duration')
    ordering = ['client_type', 'category', 'name']
