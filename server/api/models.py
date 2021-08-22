
from django.db import models
from django.contrib.postgres.fields import ArrayField


class NewContractModel(models.Model):
    addresses = ArrayField(models.IntegerField())
    OTS = models.PositiveIntegerField()
    campany_start = models.DateTimeField()
    campany_end = models.DateTimeField()
    days_of_week = ArrayField(models.PositiveIntegerField())
    time_period_start = models.PositiveIntegerField()
    time_period_end = models.PositiveIntegerField()

class Campany(models.Model):
    camp_id = models.PositiveIntegerField()
    freq = models.PositiveIntegerField()

    # def __str__(self):
    #     return str(self.ots)

