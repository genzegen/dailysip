from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    product_list,
    create_product,
    product_detail,
    update_product,
    delete_product,
    admin_dashboard_stats,
    cart_detail,
    cart_update_location,
    cart_add,
    cart_remove,
    admin_order_list,
    user_order_list,
)

urlpatterns = [
    path('', product_list, name='product_list'),
    path('dashboard/', admin_dashboard_stats, name='admin_dashboard_stats'),
    path('create/', create_product, name='create_product'),
    path('<int:pk>/', product_detail, name='product_detail'),
    path('<int:pk>/update/', update_product, name='update_product'),
    path('<int:pk>/delete/', delete_product, name='delete_product'),
    path('cart/', cart_detail, name='cart_detail'),
    path('cart/', cart_detail, name='cart_list'),
    path('cart/location/', cart_update_location, name='cart_update_location'),
    path('cart/add/', cart_add, name='cart_add'),
    path('cart/remove/<int:pk>/', cart_remove, name='cart_remove'),
    path('orders/', admin_order_list, name='admin_order_list'),
    path('my-orders/', user_order_list, name='user_order_list'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
