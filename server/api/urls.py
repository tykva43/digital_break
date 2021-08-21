from django.contrib.auth.views import LogoutView
from django.urls import path
from api import views

urlpatterns = [
    path('', views.index, name='index'),
    path('new_contract/', views.new_contract, name='new_contract'),
]