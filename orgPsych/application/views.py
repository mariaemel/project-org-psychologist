from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import ClientRequest
from .serializers import ClientRequestSerializer
from utils.telegram_utils import send_telegram_message


class ClientRequestCreateView(generics.CreateAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        obj = serializer.save()
        company = obj.company_name_juridical or '—'
        position_jur = obj.position_juridical or '—'
        position_ind = obj.position_individual or '—'
        inn = obj.inn_juridical or '—'
        preferred_comm = obj.preferred_communication or '—'
        consent = 'Да' if obj.consent_processing else 'Нет'
        service = obj.selected_service.name if obj.selected_service else 'Не выбрана'
        desired_dt = obj.desired_datetime.strftime('%Y-%m-%d %H:%M') if obj.desired_datetime else 'Не указано'
        files = obj.additional_files.url if obj.additional_files else 'Нет файлов'

        message = (
            f"<b>Новая заявка</b>\n\n"
            f"ФИО: {obj.full_name}\n"
            f"Тип клиента: {obj.get_client_type_display()}\n"
            f"Компания: {company}\n"
            f"Должность (юр. лицо): {position_jur}\n"
            f"Должность (физ. лицо): {position_ind}\n"
            f"ИНН (юр. лицо): {inn}\n"
            f"Телефон: {obj.phone}\n"
            f"Email: {obj.email}\n"
            f"Предпочитаемый способ связи: {preferred_comm}\n"
            f"Дата и время отправки: {obj.created_at.strftime('%Y-%m-%d %H:%M')}\n"
            f"Статус: {obj.get_status_display()}\n"
            f"Выбранная услуга: {service}\n"
            f"Желаемые дата и время консультации: {desired_dt}\n"
            f"Описание: {obj.request_text[:300]}...\n"
            f"Файлы: {files}\n"
            f"Согласие на обработку: {consent}"
        )
        send_telegram_message(message)


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