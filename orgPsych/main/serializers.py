from rest_framework import serializers
from .models import SpecialistInfo

class SpecialistInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialistInfo
        fields = '__all__'
