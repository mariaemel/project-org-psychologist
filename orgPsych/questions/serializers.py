from rest_framework import serializers
from .models import ClientQuestion

class ClientQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientQuestion
        fields = '__all__'
