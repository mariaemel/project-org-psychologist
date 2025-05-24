from django.contrib import admin
from .models import ClientQuestion
from django.utils.html import format_html
from orgPsych.admin_actions import export_as_excel
from utils.telegram_utils import send_telegram_message

@admin.register(ClientQuestion)
class ClientQuestionAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'question_topic', 'client_type', 'status', 'created_at', 'view_details')
    list_filter = ('client_type', 'status', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'question_text')
    actions = [export_as_excel]

    def view_details(self, obj):
        question_preview = (obj.question_text[:75] + '...') if len(obj.question_text) > 75 else obj.question_text
        return format_html(
            f'''
            <a href="#" onclick="toggleDetails('question-{obj.id}'); return false;">🔍</a>
            <div id="question-{obj.id}" class="popup-details" style="display:none; background:#f4f4f4; border:1px solid #aaa; padding:10px; margin-top:10px;">
                <strong>Номер телефона:</strong> {obj.phone}<br>
                <strong>Дата отправки:</strong> {obj.created_at.strftime("%Y-%m-%d %H:%M")}<br>
                <strong>Фрагмент вопроса:</strong> {question_preview}<br>
                <strong>Статус:</strong> {obj.get_status_display()}
            </div>
            '''
        )
    view_details.short_description = "Детали"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            company = obj.company_name_juridical or '—'
            position = obj.position_juridical or '—'
            preferred_comm = obj.preferred_communication or '—'
            additional_files = obj.additional_files.url if obj.additional_files else '—'
            consent = 'Да' if obj.consent_processing else 'Нет'

            message = (
                f"<b>Новый вопрос</b>\n\n"
                f"ФИО: {obj.full_name}\n"
                f"Тип клиента: {obj.get_client_type_display()}\n"
                f"Телефон: {obj.phone}\n"
                f"Email: {obj.email}\n"
                f"Компания: {company}\n"
                f"Должность: {position}\n"
                f"Тема: {obj.question_topic}\n"
                f"Вопрос: {obj.question_text}\n"
                f"Предпочитаемый способ связи: {preferred_comm}\n"
                f"Доп. файлы: {additional_files}\n"
                f"Согласие на обработку персональных данных: {consent}"
            )
            send_telegram_message(message)

    class Media:
        js = ('admin/js/toggle_details.js',)