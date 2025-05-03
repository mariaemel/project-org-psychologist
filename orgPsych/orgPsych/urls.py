from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main.urls')),
    path('api/', include('articles.urls')),
    path('api/', include('services.urls')),
    path('api/', include('requests.urls')),
    path('api/', include('questions.urls')),
]