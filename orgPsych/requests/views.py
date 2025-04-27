from rest_framework import generics
from .models import ClientRequest
from .serializers import ClientRequestSerializer

class ClientRequestCreateView(generics.CreateAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
