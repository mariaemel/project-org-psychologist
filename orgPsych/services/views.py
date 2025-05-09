from rest_framework import generics
from .models import Service
from .serializers import ServiceSerializer

class ServiceListView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
