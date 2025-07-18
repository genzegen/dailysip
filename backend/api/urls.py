from django.urls import path, include
from .views import *

urlpatterns = [
    path('landing_page/', landing_page),
    path('accounts/', include('accounts.urls'))
]
