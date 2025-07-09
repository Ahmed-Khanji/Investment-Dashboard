from django.db import models

class Investment(models.Model):
    date = models.DateField(auto_now_add=True)
    balance = models.DecimalField(max_digits=8,decimal_places=2)

    def __str__(self):
        return f"{self.date}: {self.balance}"