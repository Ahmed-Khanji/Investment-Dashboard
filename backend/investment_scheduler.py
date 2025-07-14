# Setup Django environment
import os
import django
import csv
from datetime import datetime
from django.utils.timezone import localdate

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import app stuff after setup
from api.utils import add_balance
from api.models import Investment

# Logging function
def log(message):
    with open("backend/scheduler_log.txt", "a") as f:
        f.write(f"[{datetime.now()}] {message}\n")

# Write balance to CSV
def write_balance_to_csv(portfolio_value, filename='backend/daily_balances.csv'):
    today = datetime.today().strftime('%Y-%m-%d')
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([today, portfolio_value])

# Main execution
def check_and_add():
    if not Investment.objects.filter(date=localdate()).exists():
        log(f"Adding balance for {localdate()}")
        portfolio_value = add_balance()
        if portfolio_value is not None:
            write_balance_to_csv(portfolio_value)
        else:
            log("Error or no data: Portfolio value was None")
    else:
        log(f"Balance already exists for {localdate()}")

check_and_add()
