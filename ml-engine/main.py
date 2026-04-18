from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predict import get_risk_scores
from train import train_model
import os

app = FastAPI()
print("🔥 NEW ML VERSION RUNNING")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🧠 Shadow Crisis ML Engine Running!"}

@app.get("/predict")
def predict():
    scores = get_risk_scores()
    return {"predictions": scores}

@app.get("/train")
def train():
    result = train_model()
    return {"message": result}