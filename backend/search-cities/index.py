import json
import urllib.request
import urllib.parse
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Search cities by name using Open-Meteo Geocoding API
    Args: event - dict with httpMethod, queryStringParameters (q - search query)
          context - object with request_id, function_name
    Returns: HTTP response with list of matching cities
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
    query = params.get('q', '').strip()
    
    if not query or len(query) < 2:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'cities': []})
        }
    
    encoded_query = urllib.parse.quote(query)
    url = f'https://geocoding-api.open-meteo.com/v1/search?name={encoded_query}&count=10&language=ru&format=json'
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
        
        results = data.get('results', [])
        cities: List[Dict[str, Any]] = []
        
        for item in results:
            city_name = item.get('name', '')
            country = item.get('country', '')
            admin1 = item.get('admin1', '')
            lat = item.get('latitude')
            lon = item.get('longitude')
            
            display_name = city_name
            if admin1 and admin1 != city_name:
                display_name = f"{city_name}, {admin1}"
            if country:
                display_name = f"{display_name}, {country}"
            
            cities.append({
                'name': city_name,
                'displayName': display_name,
                'lat': lat,
                'lon': lon,
                'country': country
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'cities': cities})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e), 'cities': []})
        }
