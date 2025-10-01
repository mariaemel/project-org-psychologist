from django.contrib import admin
from .models import FAQ

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "short_answer", "updated_at")
    search_fields = ("question", "answer")
    list_per_page = 25

    def short_answer(self, obj):
        return (obj.answer[:60] + "…") if len(obj.answer) > 60 else obj.answer
    short_answer.short_description = "Ответ (кратко)"
