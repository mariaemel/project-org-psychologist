from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from django.utils import timezone
from .models import ClientQuestion
from .serializers import ClientQuestionSerializer, ClientQuestionAdminSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class ClientQuestionCreateView(generics.CreateAPIView):
    queryset = ClientQuestion.objects.all()
    serializer_class = ClientQuestionSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

class ClientQuestionListView(generics.ListAPIView):
    queryset = ClientQuestion.objects.all()
    serializer_class = ClientQuestionAdminSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['full_name', 'phone', 'email', 'question_text', 'question_topic']
    ordering_fields = ['created_at', 'status', 'client_type']

class ClientQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClientQuestion.objects.all()
    serializer_class = ClientQuestionAdminSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        instance = serializer.instance
        new_status = serializer.validated_data.get('status', instance.status)
        new_answer = serializer.validated_data.get('answer', instance.answer)

        if new_status == 'отвечен' and new_answer and not instance.answered_at:
            serializer.save(answered_at=timezone.now())
        else:
            serializer.save()
