from django.contrib import admin
from .models import ClientRequest
from django.utils.html import format_html
from orgPsych.admin_actions import export_as_excel
from utils.telegram_utils import send_telegram_message


@admin.register(ClientRequest)
class ClientRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'client_type', 'status', 'created_at', 'view_details')
    list_filter = ('client_type', 'status', 'created_at')
    search_fields = ('full_name', 'email', 'phone')
    actions = [export_as_excel]

    def view_details(self, obj):
        company = obj.company_name_juridical if obj.client_type == 'organization' and obj.company_name_juridical else '—'
        request_preview = (obj.request_text[:75] + '...') if len(obj.request_text) > 75 else obj.request_text

        return format_html(
            f'''
            <a href="#" onclick="toggleDetails('request-{obj.id}'); return false;">🔍</a>
            <div id="request-{obj.id}" class="popup-details" style="display:none; background:#f9f9f9; border:1px solid #ccc; padding:10px; margin-top:10px;">
                <strong>ФИО:</strong> {obj.full_name}<br>
                <strong>Компания:</strong> {company}<br>
                <strong>Телефон:</strong> {obj.phone}<br>
                <strong>Дата и время:</strong> {obj.created_at.strftime("%Y-%m-%d %H:%M")}<br>
                <strong>Статус:</strong> {obj.get_status_display()}<br>
                <strong>Описание:</strong> {request_preview}
            </div>
            '''
        )
    view_details.short_description = "Детали"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            company = obj.company_name_juridical or '—'
            position_org = obj.position_juridical or '—'
            position_ind = obj.position_individual or '—'
            preferred_comm = obj.preferred_communication or '—'
            additional_files = obj.additional_files.url if obj.additional_files else '—'
            consent = 'Да' if obj.consent_processing else 'Нет'
            service = obj.selected_service.name if obj.selected_service else '—'
            desired_dt = obj.desired_datetime.strftime('%Y-%m-%d %H:%M') if obj.desired_datetime else '—'

            message = (
                f"<b>Новая заявка</b>\n\n"
                f"ФИО: {obj.full_name}\n"
                f"Тип клиента: {obj.get_client_type_display()}\n"
                f"Телефон: {obj.phone}\n"
                f"Email: {obj.email}\n"
                f"Компания: {company}\n"
                f"Должность (юр. лица): {position_org}\n"
                f"Должность (физ. лица): {position_ind}\n"
                f"Статус: {obj.get_status_display()}\n"
                f"Выбранная услуга: {service}\n"
                f"Желаемые дата и время консультации: {desired_dt}\n"
                f"Описание: {obj.request_text}\n"
                f"Предпочитаемый способ связи: {preferred_comm}\n"
                f"Доп. файлы: {additional_files}\n"
                f"Согласие на обработку персональных данных: {consent}"
            )
            send_telegram_message(message)

    class Media:
        js = ('admin/js/toggle_details.js',)