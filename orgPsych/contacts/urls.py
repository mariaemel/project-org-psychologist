from django.urls import path
from .views import ContactView

urlpatterns = [
    path('<int:pk>/', ContactView.as_view(), name='contact-detail'),
]
