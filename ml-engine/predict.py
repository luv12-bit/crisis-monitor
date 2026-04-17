import pickle
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_risk_scores():
    try:
        client = MongoClient(os.getenv("MONGO_URI"))
        db     = client["shadowcrisis"]
        events = list(db.crisisevents.find())

        if not os.path.exists("crisis_model.pkl"):
            return [{"error": "Model not trained yet. Call /train first."}]

        with open("crisis_model.pkl", "rb") as f:
            model = pickle.load(f)

        # Group by country
        country_data = {}
        for e in events:
            cc = e.get("countryCode", "WW")
            if cc not in country_data:
                country_data[cc] = {
                    "region":      e.get("region", "Unknown"),
                    "severities":  [],
                    "types":       [],
                }
            country_data[cc]["severities"].append(e.get("severity", 5))
            country_data[cc]["types"].append(e.get("type", ""))

        results = []
        for cc, data in country_data.items():
            avg_sev = sum(data["severities"]) / len(data["severities"])
            types   = data["types"]

            features = pd.DataFrame([{
                "severity":    avg_sev,
                "is_conflict": 1 if "conflict" in types  else 0,
                "is_famine":   1 if "famine"   in types  else 0,
                "is_disease":  1 if "disease"  in types  else 0,
                "is_disaster": 1 if "disaster" in types  else 0,
                "is_economic": 1 if "economic" in types  else 0,
            }])

            risk_prob  = model.predict_proba(features)[0][1]
            risk_score = round(risk_prob * 100, 1)
            risk_level = "CRITICAL" if risk_score >= 70 else "HIGH" if risk_score >= 40 else "LOW"

            results.append({
                "countryCode": cc,
                "region":      data["region"],
                "riskScore":   risk_score,
                "riskLevel":   risk_level,
                "avgSeverity": round(avg_sev, 1),
                "eventCount":  len(data["severities"]),
            })

        results.sort(key=lambda x: x["riskScore"], reverse=True)
        return results

    except Exception as e:
        return [{"error": str(e)}]