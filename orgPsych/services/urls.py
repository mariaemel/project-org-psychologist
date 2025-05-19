from django.urls import path
from .views import ServiceListView, ServiceDetailView, ServiceCreateView

urlpatterns = [
    path('list/', ServiceListView.as_view(), name='service-list'),
    path('create/', ServiceCreateView.as_view(), name='service-create'),
    path('<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
]
