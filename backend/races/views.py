from django.shortcuts import render


from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Race
from .serializers import RaceSerializer

class RaceListView(APIView):
    def get(self, request, season):
        races = Race.objects.filter(season=season)
        serializer = RaceSerializer(races, many=True)
        return Response(serializer.data)