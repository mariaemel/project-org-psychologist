from rest_framework import generics
from .models import ClientQuestion
from .serializers import ClientQuestionSerializer

class ClientQuestionCreateView(generics.CreateAPIView):
    queryset = ClientQuestion.objects.all()
    serializer_class = ClientQuestionSerializer
