from rest_framework import generics # type: ignore
from .models import Contact
from .serializers import ContactSerializer
from rest_framework.permissions import IsAdminUser, AllowAny # type: ignore

class ContactView(generics.RetrieveUpdateAPIView):
    serializer_class = ContactSerializer

    def get_object(self):
        obj, _ = Contact.objects.get_or_create(pk=1)
        return obj

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsAdminUser()]
        return [AllowAny()]
