from django.urls import path
from .views import create_product
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', create_product, name='create_product'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)