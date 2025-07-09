from decouple import config
import ccxt
from datetime import date
from .models import Investment
from .serializer import InvestmentSerializer

QUOTE_CURRENCY = config('QUOTE_CURRENCY')
api_key = config('KRAKEN_API_KEY')
api_secret = config('KRAKEN_API_SECRET')
exchange = ccxt.kraken({
    'apiKey': api_key,
    'secret': api_secret,
    'options': {
        'defaultType': 'spot',  # Ensure only spot markets are considered (no futures)
    }
})

# function to add balance to db
def add_balance():
    try:
        balances = exchange.fetch_balance() # Fetch current account balances (both free and used)
        tickers = exchange.fetch_tickers() # Fetch the latest market prices for all tickers
        portfolio_value = 0.0

        # Loop through all assets in the portfolio
        for currency, balance in balances['total'].items():
            if balance > 0:
                if currency == QUOTE_CURRENCY:
                    portfolio_value += balance
                else:
                    # Try to find a trading pair to convert this asset to USD
                    pair = f"{currency}/{QUOTE_CURRENCY}"
                    if pair in exchange.markets:
                        price = tickers[pair]['last']
                        portfolio_value += balance * price
        # Avoid duplicate entries for the same day
        if Investment.objects.filter(date=date.today()).exists():
            return
        Investment.objects.create(balance=portfolio_value)
    except ccxt.BaseError as e:
        print(f"An error occurred: {str(e)}")
        return None