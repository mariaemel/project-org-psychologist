from rest_framework import generics
from .models import SpecialistInfo
from .serializers import SpecialistInfoSerializer

class SpecialistInfoListView(generics.ListCreateAPIView):
    queryset = SpecialistInfo.objects.all()
    serializer_class = SpecialistInfoSerializer
