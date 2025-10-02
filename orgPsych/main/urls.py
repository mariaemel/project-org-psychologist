from django.urls import path
from .views import MainSpecialistInfoView, ImageAssetListCreateView, ImageAssetDetailView

urlpatterns = [
    path('specialist-info/', MainSpecialistInfoView.as_view(), name='main-specialist-info'),
    path('images/', ImageAssetListCreateView.as_view(), name='imageasset-list-create'),
    path('images/<int:pk>/', ImageAssetDetailView.as_view(), name='imageasset-detail'),
]
