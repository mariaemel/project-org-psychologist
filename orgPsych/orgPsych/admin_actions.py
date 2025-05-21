import openpyxl
from django.http import HttpResponse
from django.utils.encoding import smart_str

def export_as_excel(modeladmin, request, queryset):
    model = modeladmin.model
    opts = model._meta

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Экспорт"

    headers = [field.verbose_name for field in opts.fields]
    ws.append(headers)

    for obj in queryset:
        row = [getattr(obj, field.name) for field in opts.fields]
        ws.append([smart_str(cell) for cell in row])

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    response['Content-Disposition'] = f'attachment; filename={opts.verbose_name_plural}.xlsx'
    wb.save(response)
    return response

export_as_excel.short_description = "Экспортировать в Excel"
