from django.urls import path
from .views import AdminOnlyView, RegisterView, LoginView, AdminLoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
]
