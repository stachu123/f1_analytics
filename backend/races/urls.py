from django.urls import path
from .views import RaceListView, get_race_data

urlpatterns = [
    path('races/<int:season>/', RaceListView.as_view(), name='race-list'),
    path('race/<int:id>/', get_race_data, name='race-detail'),  
]
