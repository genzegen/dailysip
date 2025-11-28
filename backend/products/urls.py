from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', product_list, name='product_list'),
    path('create/', create_product, name='create_product'),
    path('<int:pk>/', product_detail, name='product_detail'),
    path('<int:pk>/update/', update_product, name='update_product'),
    path('<int:pk>/delete/', delete_product, name='delete_product'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)