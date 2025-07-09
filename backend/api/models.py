from django.db import models

class Investment(models.model):
    date = models.DateField(auto_now_add=True)
    balance = models.FloatField()

    def __str__(self):
        return f"{self.date}: {self.balance}"