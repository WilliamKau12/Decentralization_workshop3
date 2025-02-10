from flask import Flask, request, jsonify
import pickle
import requests
import json

app = Flask(__name__)

# Load the trained model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Error: model.pkl not found. Please train and save the model first.")
    exit(1)

@app.route('/predict', methods=['GET'])
def predict():
    # Get input features from request
    features = request.args.get('features')
    features = list(map(float, features.split(',')))

    # Make prediction
    prediction = model.predict([features])[0]

    # Return standardized response
    return jsonify({'prediction': int(prediction)})

# URLs of group members' APIs
urls = [
    'http://<ngrok-url-1>/predict',
    'http://<ngrok-url-2>/predict',
    'http://<ngrok-url-3>/predict'
]

def get_consensus_prediction(features):
    predictions = []
    for url in urls:
        response = requests.get(url, params={'features': ','.join(map(str, features))})
        predictions.append(response.json()['prediction'])
    return sum(predictions) / len(predictions)

with open('database.json', 'r') as f:
    database = json.load(f)

def update_weights(actual_values, predictions):
    for model_id, prediction in predictions.items():
        error = abs(actual_values - prediction)
        weight = 1 - error  # Simple weight adjustment
        database[model_id]['weight'] = max(0, min(1, weight))

def slash_model(model_id, penalty):
    database[model_id]['balance'] -= penalty
    if database[model_id]['balance'] < 0:
        database[model_id]['balance'] = 0
        database[model_id]['weight'] = 0  # Disable model

if __name__ == '__main__':
    app.run(debug=True)