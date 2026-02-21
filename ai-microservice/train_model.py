import pandas as pd
import numpy as np
import joblib
import os
import requests
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta

# Fetch live campaign data from backend API
def fetch_live_data(days=30):
    end = datetime.now()
    start = end - timedelta(days=days)
    response = requests.get(
        f"{os.getenv('BACKEND_URL')}/api/admin/campaign-data",
        params={'start': start.isoformat(), 'end': end.isoformat()},
        headers={'Authorization': f"Bearer {os.getenv('ADMIN_TOKEN')}"}
    )
    return response.json()

def train_model(data):
    df = pd.DataFrame(data)
    # Features: budget, audience_size, industry (one-hot)
    features = pd.get_dummies(df[['budget', 'audience_size', 'industry']], columns=['industry'])
    targets = df[['ctr', 'conversions', 'roi']]
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(features, targets)
    
    # Save model
    joblib.dump(model, 'models/marketing_predictor.pkl')
    print("Model trained and saved.")

if __name__ == "__main__":
    data = fetch_live_data()
    train_model(data)
