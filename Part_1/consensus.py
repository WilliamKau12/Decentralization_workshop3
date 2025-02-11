import requests
from config import API_URLS

def get_consensus_prediction(features):
    predictions = []
    
    for url in API_URLS:
        try:
            response = requests.get(url, params={'features': ','.join(map(str, features))})
            if response.status_code == 200:
                predictions.append(response.json()['prediction'])
        except requests.exceptions.RequestException:
            print(f"Error connecting to {url}")
    
    if predictions:
        return sum(predictions) / len(predictions)
    else:
        return None  # No valid predictions received
