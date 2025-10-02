from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import HomePage
from .serializers import HomePageSerializer

class HomePageView(generics.RetrieveUpdateAPIView):
    serializer_class = HomePageSerializer

    def get_object(self):
        obj, _ = HomePage.objects.get_or_create(pk=1)
        return obj

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [IsAdminUser()]
        return [AllowAny()]
