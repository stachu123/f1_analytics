import os
import csv
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


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

@csrf_exempt
def get_race_data(request, race_id):

    csv_directory = os.path.join(settings.MEDIA_ROOT, 'race_csvs')

    file_path = os.path.join(csv_directory, f'{race_id}.csv')

    if not os.path.exists(file_path):
        raise Http404("File not found")

    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        race_data = list(reader)

    return JsonResponse(race_data, safe=False)

