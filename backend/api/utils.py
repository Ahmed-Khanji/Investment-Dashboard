from decouple import config
import ccxt
from datetime import date
from .models import Investment

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

# Function to add balance and return portfolio value
def add_balance():
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

        # Return the total value only — no DB write or duplicate check here
        return portfolio_value

    except ccxt.BaseError as e:
        print(f"An error occurred: {str(e)}")
        return None