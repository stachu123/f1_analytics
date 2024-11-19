from django.urls import path, include
from .views import RaceListView

urlpatterns = [
    path('races/<int:season>', RaceListView.as_view(), name='race-list'),
]