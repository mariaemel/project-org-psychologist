from django.urls import path
from .views import ClientRequestCreateView, ClientRequestListView, ClientRequestDetailView

urlpatterns = [
    path('create/', ClientRequestCreateView.as_view(), name='request-create'),
    path('archive/', ClientRequestListView.as_view(), name='request-archive-list'),
    path('archive/<int:pk>/', ClientRequestDetailView.as_view(), name='request-archive-detail'),
]
