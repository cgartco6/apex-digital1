from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load('models/marketing_predictor.pkl')

class CampaignInput(BaseModel):
    budget: float
    audience_size: int
    industry: str

@app.post("/predict")
def predict(input: CampaignInput):
    # Simple mock prediction – replace with real model
    ctr = np.random.uniform(2, 8)
    conversions = int(input.budget * 0.05)
    roi = np.random.uniform(150, 400)
    return {"ctr": ctr, "conversions": conversions, "roi": roi}
