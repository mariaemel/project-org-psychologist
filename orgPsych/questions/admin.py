from django.contrib import admin
from .models import ClientQuestion
from django.utils.html import format_html
from orgPsych.admin_actions import export_as_excel


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

    class Media:
        js = ('admin/js/toggle_details.js',)
