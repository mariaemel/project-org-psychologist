from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import FAQ
from .serializers import FAQSerializer

class FaqItemListCreateView(generics.ListCreateAPIView):
    queryset = FAQ.objects.all().order_by("-created_at")
    serializer_class = FAQSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [AllowAny()]

class FaqItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAdminUser()]
        return [AllowAny()]
