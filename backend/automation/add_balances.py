# Gets value from Kraken API → Appends to daily_balances.csv

# Import
import os
import django
import csv
from datetime import datetime
from decouple import config
import ccxt

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Investment
from django.utils.timezone import localdate

# === Config Kraken ===
QUOTE_CURRENCY = config('QUOTE_CURRENCY')
api_key = config('KRAKEN_API_KEY')
api_secret = config('KRAKEN_API_SECRET')

exchange = ccxt.kraken({
    'apiKey': api_key,
    'secret': api_secret,
    'options': {
        'defaultType': 'spot',
    }
})

# === Function to get today's balance ===
def get_balance():
    try:
        balances = exchange.fetch_balance()
        tickers = exchange.fetch_tickers()
        portfolio_value = 0.0

        for currency, balance in balances['total'].items():
            if balance > 0:
                if currency == QUOTE_CURRENCY:
                    portfolio_value += balance
                else:
                    pair = f"{currency}/{QUOTE_CURRENCY}"
                    if pair in exchange.markets:
                        price = tickers[pair]['last']
                        portfolio_value += balance * price

        return portfolio_value
    except ccxt.BaseError as e:
        print(f"An error occurred: {str(e)}")
        return None

# === Write to CSV ===
def write_balance_to_csv(value, path='backend/automation/daily_balances.csv'):
    today = datetime.today().strftime('%Y-%m-%d')
    with open(path, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([today, round(value, 2)])

# === Log info ===
def log(message):
    with open("backend/automation/scheduler_log.txt", "a") as f:
        f.write(f"[{datetime.now()}] {message}\n")

# === Main execution ===
def run():
    today = localdate()
    if not Investment.objects.filter(date=today).exists():
        log(f"Adding balance for {today}")
        value = get_balance()
        if value is not None:
            write_balance_to_csv(value)
        else:
            log("Error: No balance returned")
    else:
        log(f"Balance already exists for {today}")

# === Trigger ===
run()
