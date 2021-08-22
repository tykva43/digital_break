from django.contrib.auth.views import LogoutView
from django.urls import path
from api import views

urlpatterns = [
    path('', views.index, name='index'),
    path('new_contract/', views.NewContractView.as_view(), name='new_contract'),
    path('get_campany/', views.CampanyView.as_view(), name='get_campany'),
    path('csv/', views.get_csv, name='csv')
]