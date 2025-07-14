# Setup Django environment
import os
import django
import time
from datetime import date, datetime
from django.utils.timezone import localdate

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import app stff after setup
from api.utils import add_balance
from api.models import Investment

# Logging function (to log to a file)
def log(message):
    with open("backend/scheduler_log.txt", "a") as f:
        f.write(f"[{datetime.now()}] {message}\n")

# Function to check and add balance
def check_and_add():
    if not Investment.objects.filter(date=localdate()).exists():
        log(f"Adding balance for {localdate()}")
        add_balance()
    else:
        log(f"Balance already exists for {localdate()}")
check_and_add()