from rest_framework import generics
from .models import SpecialistInfo
from .serializers import SpecialistInfoSerializer
from rest_framework.permissions import IsAdminUser, AllowAny

class MainSpecialistInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = SpecialistInfoSerializer

    def get_object(self):
        obj, _ = SpecialistInfo.objects.get_or_create(pk=1)
        return obj

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsAdminUser()]
        return [AllowAny()]


# потом поменяю
from django.http import HttpResponse
def home(request):
    return HttpResponse("Добро пожаловать на сайт специалиста по организационной психологии!")
