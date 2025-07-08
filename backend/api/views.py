from django.shortcuts import render
from django.http import JsonResponse
import ccxt
from decouple import config

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

# return current overall money (owned assets + fiat) at this moment in the porfolio (excluding locked assets)
def get_balance(request):
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
        
        return JsonResponse({'balance': round(portfolio_value, 2)})
    except ccxt.BaseError as e:
        print(f"An error occurred: {str(e)}")
        return None

# return current fiat (available usd in portfolio)
def get_usd_left(request):
    available = exchange.fetch_balance()['free'].get(QUOTE_CURRENCY, 0)
    return JsonResponse({'available': round(available, 2)})

# return assets owned ([{symbol: amount}, ...])
def get_assets(request):
    balances = exchange.fetch_balance()
    assets = [
        {'symbol': symbol, 'amount': amount}
        for symbol, amount in balances['total'].items()
        if amount > 0
    ]
    return JsonResponse(assets, safe=False)
