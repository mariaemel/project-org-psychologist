from rest_framework import generics, permissions
from .models import SpecialistInfo, ImageAsset
from .serializers import SpecialistInfoSerializer, ImageAssetSerializer
from rest_framework.permissions import IsAdminUser, AllowAny
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Specialist Info"], summary="Получить/обновить информацию о специалисте")
class MainSpecialistInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = SpecialistInfoSerializer

    def get_object(self):
        obj, _ = SpecialistInfo.objects.get_or_create(pk=1)
        return obj

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [IsAdminUser()]
        return [AllowAny()]

@extend_schema(tags=["Images"], summary="Список изображений / загрузка нового")
class ImageAssetListCreateView(generics.ListCreateAPIView):
    queryset = ImageAsset.objects.all()
    serializer_class = ImageAssetSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [AllowAny()]

@extend_schema(tags=["Images"], summary="Получить/обновить/удалить изображение")
class ImageAssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ImageAsset.objects.all()
    serializer_class = ImageAssetSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAdminUser()]
        return [AllowAny()]
