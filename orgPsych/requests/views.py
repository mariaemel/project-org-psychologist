from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import ClientRequest
from .serializers import ClientRequestSerializer

class ClientRequestCreateView(generics.CreateAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [AllowAny]

class ClientRequestListView(generics.ListAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['full_name', 'company', 'phone', 'email', 'request_text']
    ordering_fields = ['created_at', 'status', 'client_type']

class ClientRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [IsAdminUser]
