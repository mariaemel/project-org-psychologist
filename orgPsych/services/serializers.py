from rest_framework import serializers # type: ignore
from .models import Service, CATEGORY_CHOICES_INDIVIDUAL, CATEGORY_CHOICES_ORGANIZATION


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

    def validate(self, data):
        client_type = data.get('client_type', self.instance.client_type if self.instance else None)
        category = data.get('category')

        if client_type == 'individual':
            valid_categories = dict(CATEGORY_CHOICES_INDIVIDUAL).keys()
        elif client_type == 'organization':
            valid_categories = dict(CATEGORY_CHOICES_ORGANIZATION).keys()
        else:
            valid_categories = []

        if category not in valid_categories:
            raise serializers.ValidationError({
                'category': 'Неверная категория для выбранного типа клиента.'
            })

        return data
