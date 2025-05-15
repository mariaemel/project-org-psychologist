from rest_framework import serializers
from .models import ClientRequest

class ClientRequestSerializer(serializers.ModelSerializer):
    selected_service_name = serializers.CharField(source='selected_service.name', read_only=True)

    class Meta:
        model = ClientRequest
        fields = '__all__'
        read_only_fields = ['status', 'created_at']

    def validate_consent_processing(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо согласие на обработку персональных данных.")
        return value
