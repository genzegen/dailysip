from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
import os

def _env_truthy(name: str, default: str = 'False') -> bool:
    value = os.environ.get(name, default)
    return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}

urlpatterns = [
    # Rename Django admin to /django-admin/ instead of /admin/
    path('django-admin/', admin.site.urls),
    
    # Your API routes
    path('api/', include('products.urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('api.urls')),
    
    # Serve React app for all other routes (including /admin)
    # This MUST be last - it's a catch-all
    re_path(r'^(?!api|django-admin|static|media).*$', TemplateView.as_view(template_name='index.html')),
]

# Serve media files in development
if settings.DEBUG or _env_truthy('SERVE_MEDIA', 'False'):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)