# Setup Django environment
import os
import django
import time
from datetime import date, datetime
import schedule

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Change this
django.setup()

# Logging function (to log to a file)
def log(message):
    with open("scheduler_log.txt", "a") as f:
        f.write(f"[{datetime.now()}] {message}\n")

# Import after setup
from api.utils import add_balance
from api.models import Investment

# Function to check and add balance
def check_and_add():
    if not Investment.objects.filter(date=date.today()).exists():
        log(f"Adding balance for {date.today()}")
        add_balance()
    else:
        log(f"Balance already exists for {date.today()}")

# Initial run + schedule every 12 hours
check_and_add()
schedule.every(12).hours.do(check_and_add)

log("Investment scheduler is running...")
while True:
    schedule.run_pending()
    time.sleep(3600)  # 3600 seconds = 1 hour