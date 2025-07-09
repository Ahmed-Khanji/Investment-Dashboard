from django.urls import path
from . import views

urlpatterns = [
    path('all-balances', views.get_all_balances),
]