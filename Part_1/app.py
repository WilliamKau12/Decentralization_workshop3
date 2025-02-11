from flask import Flask, request, jsonify
from model import load_model, make_prediction
from consensus import get_consensus_prediction
from database import update_weights, slash_model, load_database
import json

app = Flask(__name__)

# Load model
model = load_model()

@app.route('/predict', methods=['GET'])
def predict():
    features = request.args.get('features')
    features = list(map(float, features.split(',')))

    prediction = make_prediction(model, features)

    return jsonify({'prediction': int(prediction)})

@app.route('/consensus', methods=['GET'])
def consensus():
    features = request.args.get('features')
    features = list(map(float, features.split(',')))

    consensus_prediction = get_consensus_prediction(features)
    
    return jsonify({'consensus_prediction': consensus_prediction})

if __name__ == '__main__':
    app.run(debug=True)
