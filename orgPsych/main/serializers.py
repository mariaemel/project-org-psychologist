from rest_framework import serializers
from .models import SpecialistInfo, ImageAsset

class SpecialistInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialistInfo
        fields = "__all__"

class ImageAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageAsset
        fields = "__all__"
