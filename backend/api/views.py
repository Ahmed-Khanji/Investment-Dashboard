from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
import ccxt
from datetime import date
from decouple import config
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

# get array/db of balances with their respective time
@api_view(['GET'])
def get_all_balances(request):
    stats = Investment.objects.all()
    serializedData = InvestmentSerializer(stats, many=True)
    return Response(serializedData.data)
