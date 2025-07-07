from django.urls import path
from . import views

urlpatterns = [
    path('balance/', views.get_balance),
    path('assets', views.get_assets),
    path('fiat', views.get_usd_left),
]