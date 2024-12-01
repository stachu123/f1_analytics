import os
import csv
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import pandas as pd

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
def get_race_data(request, id):
    try:
        # Construct the CSV file path based on the race ID
        csv_file_path = os.path.join(
            settings.MEDIA_ROOT, f"race_csvs/{id}.csv"
        )
        
        # Check if the file exists
        if not os.path.exists(csv_file_path):
            return JsonResponse({'error': 'Race data not found'}, status=404)
        
        # Read the CSV file
        jsonArray = []

        with open(csv_file_path, encoding='utf-8') as csvf:
            csvReader = csv.DictReader(csvf)

            for row in csvReader:
                jsonArray.append(row)

        data_json = jsonArray

                
        
        # Return the data as a JSON response
        return JsonResponse({'race_id': id, 'data': data_json}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

