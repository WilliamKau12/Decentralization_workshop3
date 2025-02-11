import json
import os

DB_FILE = 'database.json'

def load_database():
    if not os.path.exists(DB_FILE) or os.stat(DB_FILE).st_size == 0:
        print("Warning: database.json is empty. Initializing default values.")
        return {
            "model_1": { "balance": 1000, "weight": 1.0 },
            "model_2": { "balance": 1000, "weight": 1.0 }
        }

    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        print("Error: database.json is corrupted. Resetting...")
        return {
            "model_1": { "balance": 1000, "weight": 1.0 },
            "model_2": { "balance": 1000, "weight": 1.0 }
        }

def save_database(database):
    with open(DB_FILE, "w") as f:
        json.dump(database, f, indent=4)

# Load database at startup
database = load_database()
save_database(database)  # Ensure the file is always valid

def update_weights(actual_values, predictions):
    database = load_database()
    for model_id, prediction in predictions.items():
        error = abs(actual_values - prediction)
        weight = 1 - error  # Simple weight adjustment
        database[model_id]['weight'] = max(0, min(1, weight))
    save_database(database)

def slash_model(model_id, penalty):
    database = load_database()
    if model_id in database:
        database[model_id]['balance'] -= penalty
        if database[model_id]['balance'] < 0:
            database[model_id]['balance'] = 0
            database[model_id]['weight'] = 0  # Disable model
    save_database(database)
