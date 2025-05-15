from django.urls import path
from .views import ClientRequestCreateView, ClientRequestListView, ClientRequestDetailView

urlpatterns = [
    path('requests/create/', ClientRequestCreateView.as_view(), name='request-create'),
    path('requests/archive/', ClientRequestListView.as_view(), name='request-archive-list'),
    path('requests/archive/<int:pk>/', ClientRequestDetailView.as_view(), name='request-archive-detail'),
]
