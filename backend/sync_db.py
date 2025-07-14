import os
import django
import csv
from datetime import datetime
from django.utils.timezone import make_aware

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Investment

def sync_db(csv_file='backend/daily_balances.csv'):
    with open(csv_file, mode='r') as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) != 2:
                continue  # skip bad rows
            date_str, value_str = row
            try:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                value = float(value_str)

                # Add only if not exists
                if not Investment.objects.filter(date=date_obj).exists():
                    print("Adding")
                    Investment.objects.create(date=date_obj, balance=value)
            except Exception as e:
                print(f"Failed to parse row {row}: {e}")

sync_db()
