from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    client_type_display = serializers.CharField(source='get_client_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'description',
            'price',
            'duration',
            'is_active',
            'client_type',
            'client_type_display',
            'category',
            'category_display',
        ]
