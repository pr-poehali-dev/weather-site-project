import json
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get weather data by coordinates using Open-Meteo API
    Args: event - dict with httpMethod, queryStringParameters (lat, lon)
          context - object with request_id, function_name
    Returns: HTTP response with weather data
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
    
    url = f'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7'
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
        
        weather_codes = {
            0: 'Ясно',
            1: 'Переменная облачность',
            2: 'Переменная облачность',
            3: 'Облачно',
            45: 'Туман',
            48: 'Туман',
            51: 'Морось',
            53: 'Морось',
            55: 'Сильная морось',
            61: 'Небольшой дождь',
            63: 'Дождь',
            65: 'Сильный дождь',
            71: 'Небольшой снег',
            73: 'Снег',
            75: 'Сильный снег',
            77: 'Снежные зёрна',
            80: 'Ливень',
            81: 'Ливень',
            82: 'Сильный ливень',
            85: 'Снегопад',
            86: 'Сильный снегопад',
            95: 'Гроза',
            96: 'Гроза с градом',
            99: 'Гроза с градом'
        }
        
        current = data.get('current', {})
        hourly = data.get('hourly', {})
        daily = data.get('daily', {})
        
        weather_code = current.get('weather_code', 0)
        
        result = {
            'current': {
                'temp': round(current.get('temperature_2m', 0)),
                'feelsLike': round(current.get('apparent_temperature', 0)),
                'humidity': current.get('relative_humidity_2m', 0),
                'windSpeed': round(current.get('wind_speed_10m', 0)),
                'condition': weather_codes.get(weather_code, 'Неизвестно'),
                'weatherCode': weather_code
            },
            'hourly': {
                'time': hourly.get('time', [])[:24],
                'temperature': [round(t) if t is not None else 0 for t in hourly.get('temperature_2m', [])[:24]],
                'precipitation': hourly.get('precipitation_probability', [])[:24],
                'weatherCode': hourly.get('weather_code', [])[:24]
            },
            'daily': {
                'time': daily.get('time', []),
                'tempMax': [round(t) if t is not None else 0 for t in daily.get('temperature_2m_max', [])],
                'tempMin': [round(t) if t is not None else 0 for t in daily.get('temperature_2m_min', [])],
                'weatherCode': daily.get('weather_code', [])
            }
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
            'body': json.dumps({'error': str(e)})
        }
