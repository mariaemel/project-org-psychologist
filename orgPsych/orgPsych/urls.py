from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView # type: ignore


urlpatterns = [
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
    path('articles/', include('articles.urls')),
    path('contacts/', include('contacts.urls')),
    path('services/', include('services.urls')),
    path('application/', include('application.urls')),
    path('questions/', include('questions.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
