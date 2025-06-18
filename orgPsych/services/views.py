from rest_framework import generics, filters
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Service
from .serializers import ServiceSerializer

class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'client_type']
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Service.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)

        client_type = self.request.query_params.get('client_type')
        if client_type:
            queryset = queryset.filter(client_type=client_type)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        return queryset


class ServiceCreateView(generics.CreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
