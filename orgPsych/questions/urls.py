from django.urls import path
from .views import ClientQuestionCreateView, ClientQuestionListView, ClientQuestionDetailView

urlpatterns = [
    path('create/', ClientQuestionCreateView.as_view(), name='question-create'),
    path('archive/', ClientQuestionListView.as_view(), name='question-archive-list'),
    path('archive/<int:pk>/', ClientQuestionDetailView.as_view(), name='question-archive-detail'),
]
