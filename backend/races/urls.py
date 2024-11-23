from django.urls import path, include
from .views import RaceListView

urlpatterns = [
    path('races/<int:season>', RaceListView.as_view(), name='race-list'),
    path('races/<int:id>/', RaceDetailView.as_view(), name='race-detail'),
]