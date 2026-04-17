import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def train_model():
    try:
        client = MongoClient(os.getenv("MONGO_URI"))
        db     = client["shadowcrisis"]
        events = list(db.crisisevents.find())

        if len(events) < 5:
            return "Not enough data to train. Need at least 5 events."

        # Build features
        rows = []
        for e in events:
            rows.append({
                "severity":        e.get("severity", 5),
                "is_conflict":     1 if e.get("type") == "conflict"  else 0,
                "is_famine":       1 if e.get("type") == "famine"    else 0,
                "is_disease":      1 if e.get("type") == "disease"   else 0,
                "is_disaster":     1 if e.get("type") == "disaster"  else 0,
                "is_economic":     1 if e.get("type") == "economic"  else 0,
                "risk_label":      1 if e.get("severity", 5) >= 7   else 0,
            })

        df = pd.DataFrame(rows)
        X  = df.drop("risk_label", axis=1)
        y  = df["risk_label"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        acc = accuracy_score(y_test, model.predict(X_test))

        # Save model
        with open("crisis_model.pkl", "wb") as f:
            pickle.dump(model, f)

        return f"✅ Model trained! Accuracy: {round(acc * 100, 1)}% on {len(events)} events."

    except Exception as e:
        return f"❌ Training error: {str(e)}"