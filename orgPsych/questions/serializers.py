from rest_framework import serializers
from .models import ClientQuestion

class ClientQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientQuestion
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'answer', 'answered_at']

    def validate_consent_processing(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо согласие на обработку персональных данных.")
        return value

class ClientQuestionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientQuestion
        fields = '__all__'
        read_only_fields = [
            'created_at', 'answered_at', 'phone', 'email', 'question_text',
            'client_type', 'full_name', 'question_topic', 'position_juridical',
            'company_name_juridical', 'inn_juridical', 'preferred_communication',
            'additional_files', 'consent_processing'
        ]
