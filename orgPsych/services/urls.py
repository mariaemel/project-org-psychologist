from django.urls import path
from .views import ServiceListView, ServiceDetailView, ServiceCreateView

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('services/create/', ServiceCreateView.as_view(), name='service-create'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
]
