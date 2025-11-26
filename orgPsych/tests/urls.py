from django.urls import path
from .views import (
    TestListView, TestDetailView, AttemptStartView, QuestionGetView,
    AnswerAndNextView, AttemptFinishView, PublicResultView
)

urlpatterns = [
    path("list", TestListView.as_view()),
    path("<slug:slug>", TestDetailView.as_view()),
    path("attempts/start", AttemptStartView.as_view()),
    path("attempts/<int:attempt_id>/question/<int:idx>", QuestionGetView.as_view()),
    path("attempts/<int:attempt_id>/answer-and-next", AnswerAndNextView.as_view()),
    path("attempts/<int:attempt_id>/finish", AttemptFinishView.as_view()),
    path("<slug:slug>/results/<uuid:uuid>", PublicResultView.as_view()),
]
