import json
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get city name by coordinates using Open-Meteo Geocoding API
    Args: event - dict with httpMethod, queryStringParameters (lat, lon)
          context - object with request_id, function_name
    Returns: HTTP response with location data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    lat = params.get('lat', '55.7558')
    lon = params.get('lon', '37.6173')
    
    url = f'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&accept-language=ru'
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'WeatherApp/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
        
        address = data.get('address', {})
        city = address.get('city') or address.get('town') or address.get('village') or address.get('state', 'Неизвестно')
        country = address.get('country', '')
        
        result = {
            'city': city,
            'country': country,
            'fullName': f"{city}, {country}" if country else city
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e), 'city': 'Москва', 'country': 'Россия', 'fullName': 'Москва, Россия'})
        }
