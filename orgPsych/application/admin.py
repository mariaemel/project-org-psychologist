from django.contrib import admin
from .models import ClientRequest
from django.utils.html import format_html
from orgPsych.admin_actions import export_as_excel


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

    class Media:
        js = ('admin/js/toggle_details.js',)
