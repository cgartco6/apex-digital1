from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from typing import Optional, List
import openai
import os
from datetime import datetime, timedelta
import redis

app = FastAPI(title="Apex Digital AI Microservice")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis for caching
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

# OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Load models (create dummy if not exists)
try:
    marketing_model = joblib.load('models/marketing_predictor.pkl')
except:
    marketing_model = None

class CampaignInput(BaseModel):
    budget: float
    audience_size: int
    industry: str
    goals: Optional[dict] = {}

class DesignPrompt(BaseModel):
    prompt: str
    style: str
    count: Optional[int] = 1

class CampaignResponse(BaseModel):
    ctr: float
    conversions: int
    roi: float
    confidence: float

class DesignResponse(BaseModel):
    urls: List[str]
    style: str

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[dict] = {}

@app.get("/")
async def root():
    return {"service": "Apex Digital AI Microservice", "status": "active"}

@app.post("/predict", response_model=CampaignResponse)
async def predict_campaign(input: CampaignInput):
    """Predict campaign performance using ML model"""
    
    # Check cache
    cache_key = f"campaign:{input.industry}:{input.budget}:{input.audience_size}"
    cached = redis_client.get(cache_key)
    
    if cached:
        import json
        return json.loads(cached)
    
    if marketing_model:
        # Use actual ML model
        features = pd.DataFrame([{
            'budget': input.budget,
            'audience_size': input.audience_size,
            'industry': input.industry
        }])
        # One-hot encode industry
        features = pd.get_dummies(features, columns=['industry'])
        
        prediction = marketing_model.predict(features)[0]
        ctr, conversions, roi = prediction
    else:
        # Fallback to simulated predictions
        import random
        ctr = random.uniform(2.0, 8.0)
        conversions = int(input.budget * random.uniform(0.03, 0.08))
        roi = random.uniform(50, 400)
    
    confidence = 0.85  # Simulated confidence
    
    result = {
        "ctr": round(ctr, 2),
        "conversions": conversions,
        "roi": round(roi, 2),
        "confidence": confidence
    }
    
    # Cache for 1 hour
    import json
    redis_client.setex(cache_key, 3600, json.dumps(result))
    
    return result

@app.post("/generate-design", response_model=DesignResponse)
async def generate_design(input: DesignPrompt):
    """Generate design using DALL-E"""
    
    try:
        style_prompts = {
            'classic': 'timeless, elegant, traditional',
            'cartoon': 'colorful, playful, animated',
            'traditional': 'hand-drawn, organic, artistic',
            'modern': 'minimalist, clean, contemporary',
            'futuristic': 'sci-fi, high-tech, innovative',
            'out-of-the-box': 'creative, unconventional, surprising'
        }
        
        style_desc = style_prompts.get(input.style, 'professional')
        enhanced_prompt = f"Create a {style_desc} design: {input.prompt}. High quality, print-ready."
        
        response = openai.Image.create(
            prompt=enhanced_prompt,
            n=input.count,
            size="1024x1024"
        )
        
        urls = [img['url'] for img in response['data']]
        
        return DesignResponse(urls=urls, style=input.style)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_ai(message: ChatMessage):
    """AI chat endpoint for Robyn"""
    
    try:
        system_prompt = """You are Robyn, an AI assistant for Apex Digital. 
        You help with design projects, marketing campaigns, payments, and payouts. 
        Be friendly, professional, and concise. 
        Current date: """ + datetime.now().strftime("%Y-%m-%d")
        
        if message.context:
            system_prompt += f"\nUser context: {message.context}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message.message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        reply = response.choices[0].message.content
        
        return {"reply": reply}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-design")
async def analyze_design(image_url: str):
    """Analyze design using GPT-4 Vision"""
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional design critic. Analyze the design and provide constructive feedback."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Please analyze this design:"},
                        {"type": "image_url", "image_url": image_url}
                    ]
                }
            ],
            max_tokens=500
        )
        
        analysis = response.choices[0].message.content
        
        return {"analysis": analysis}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models": {
            "marketing_model": marketing_model is not None
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
