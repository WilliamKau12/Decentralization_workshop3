import pickle

def load_model():
    try:
        with open('model.pkl', 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully!")
        return model
    except FileNotFoundError:
        print("Error: model.pkl not found. Please train and save the model first.")
        exit(1)

def make_prediction(model, features):
    return model.predict([features])[0]
