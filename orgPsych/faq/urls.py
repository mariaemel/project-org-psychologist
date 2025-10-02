from django.urls import path
from .views import FaqItemListCreateView, FaqItemDetailView

urlpatterns = [
    path("", FaqItemListCreateView.as_view(), name="faq-list-create"),
    path("<int:pk>/", FaqItemDetailView.as_view(), name="faq-detail"),
]
