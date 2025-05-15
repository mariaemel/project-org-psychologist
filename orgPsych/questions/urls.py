from django.urls import path
from .views import ClientQuestionCreateView, ClientQuestionListView, ClientQuestionDetailView

urlpatterns = [
    path('questions/create/', ClientQuestionCreateView.as_view(), name='question-create'),
    path('questions/archive/', ClientQuestionListView.as_view(), name='question-archive-list'),
    path('questions/archive/<int:pk>/', ClientQuestionDetailView.as_view(), name='question-archive-detail'),
]
