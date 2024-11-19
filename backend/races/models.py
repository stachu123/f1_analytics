from django.db import models
from django.db import models

class Race(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    location = models.CharField(max_length=100)
    season = models.CharField(max_length=100)
    track = models.CharField(max_length=100)

    def __str__(self):
        return self.name