from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from django.utils import timezone
from .models import ClientQuestion
from .serializers import ClientQuestionSerializer, ClientQuestionAdminSerializer
from utils.telegram_utils import send_telegram_message
from rest_framework.parsers import MultiPartParser, FormParser


class ClientQuestionCreateView(generics.CreateAPIView):
    queryset = ClientQuestion.objects.all()
    serializer_class = ClientQuestionSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        instance = serializer.save()
        company = instance.company_name_juridical or '—'
        position = instance.position_juridical or '—'
        inn = instance.inn_juridical or '—'
        preferred_comm = instance.preferred_communication or '—'
        consent = 'Да' if instance.consent_processing else 'Нет'
        files = instance.additional_files.url if instance.additional_files else 'Нет файлов'

        message = (
            f"<b>Новый вопрос</b>\n\n"
            f"ФИО: {instance.full_name}\n"
            f"Тип клиента: {instance.get_client_type_display()}\n"
            f"Компания: {company}\n"
            f"Должность: {position}\n"
            f"ИНН: {inn}\n"
            f"Телефон: {instance.phone}\n"
            f"Email: {instance.email}\n"
            f"Предпочитаемый способ связи: {preferred_comm}\n"
            f"Дата: {instance.created_at.strftime('%Y-%m-%d %H:%M')}\n"
            f"Тема: {instance.question_topic}\n"
            f"Описание: {instance.question_text[:300]}...\n"
            f"Файлы: {files}\n"
            f"Согласие на обработку: {consent}"
        )
        send_telegram_message(message)



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
