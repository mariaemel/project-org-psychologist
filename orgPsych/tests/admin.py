from django.contrib import admin
from .models import Test, Question, Option, ScoringRule, Attempt, Answer, Result, ResultDimension, ShareLink

class OptionInline(admin.TabularInline):
    model = Option
    extra = 0

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id","test","order_index","type","required")
    list_filter = ("test","type")
    search_fields = ("text",)
    inlines = [OptionInline]
    ordering = ("test","order_index")

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ("id","title","slug","is_published","est_minutes","updated_at")
    list_filter = ("is_published",)
    search_fields = ("title","short_description","instructions_md")

@admin.register(ScoringRule)
class ScoringRuleAdmin(admin.ModelAdmin):
    list_display = ("id","test","rule_type","updated_at")
    list_filter = ("rule_type","test")

@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ("id","test","status","started_at","updated_at","progress_index")
    list_filter = ("status","test")
    search_fields = ("client_fingerprint_hash",)

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id","attempt","question","saved_at")
    list_filter = ("question__test",)
    search_fields = ("text_value",)

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("id","attempt","computed_at")
    date_hierarchy = "computed_at"

@admin.register(ResultDimension)
class ResultDimensionAdmin(admin.ModelAdmin):
    list_display = ("id","result","code","score","level")

@admin.register(ShareLink)
class ShareLinkAdmin(admin.ModelAdmin):
    list_display = ("uuid","attempt","is_active","created_at")
    list_filter = ("is_active",)
