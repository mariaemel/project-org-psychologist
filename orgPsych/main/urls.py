from django.urls import path
from . import views
from .views import MainSpecialistInfoView

urlpatterns = [
    path('specialist-info/', MainSpecialistInfoView.as_view(), name='main-specialist-info'),
]
