from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import io
from typing import Dict
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="Student Dropout Prediction API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="."), name="static")

# Load Models on Startup
try:
    predictor_model = joblib.load('exported_assets/voting_classifier.pkl')
    surrogate_model = joblib.load('exported_assets/surrogate_xgb.pkl')
    shap_explainer = joblib.load('exported_assets/shap_explainer.pkl')
    target_encoder = joblib.load('exported_assets/target_encoder.pkl')
    print("🚀 All ML assets loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load ML assets: {e}")


# Endpoint 1: Prediction
@app.post("/predict")
def predict_dropout(data: Dict[str, float]):
    try:
        # FastAPI automatically parses the JSON into a dictionary
        input_df = pd.DataFrame([data])
        
        expected_features = getattr(predictor_model, 'feature_names_in_', None)
        if expected_features is not None:
            input_df = input_df[expected_features]
        
        numerical_pred = predictor_model.predict(input_df)[0]
        text_prediction = target_encoder.inverse_transform([numerical_pred])[0]
        
        probabilities = predictor_model.predict_proba(input_df)[0]
        class_probs = {target_encoder.classes_[i]: float(probabilities[i]) for i in range(len(probabilities))}
        
        return {
            "prediction": text_prediction,
            "confidence_scores": class_probs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# Endpoint 2: Explainability
# Endpoint 2: Explainability
@app.post("/explain")
def explain_dropout(data: Dict[str, float]):
    try:
        input_df = pd.DataFrame([data])
        
        expected_features = getattr(predictor_model, 'feature_names_in_', None)
        if expected_features is not None:
            input_df = input_df[expected_features]
        
        # 1. Figure out what the surrogate model predicted
        numerical_pred = surrogate_model.predict(input_df)[0]
        
        # 2. Get the SHAP values
        shap_values = shap_explainer(input_df)
        
        # 3. Safely handle the multi-class SHAP dimensions
        if len(shap_values.values.shape) == 3:
            # Multi-class: Extract the explanation specifically for the predicted class
            raw_values = shap_values.values[0, :, numerical_pred].tolist()
        else:
            # Binary/Standard: Extract the standard 1D array
            raw_values = shap_values.values[0].tolist() 
            
        feature_names = input_df.columns.tolist()
        
        return {
            "shap_values": raw_values,
            "features": feature_names
        }
    except Exception as e:
        # This will print the exact error in your FastAPI terminal if it fails again
        print(f"SHAP Error: {str(e)}") 
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")

# Endpoint 2.5: Batch Prediction
@app.post("/predict_batch")
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Keep track of identifiers if they exist, but we might just use row numbers
        identifiers = df["Student ID"].tolist() if "Student ID" in df.columns else df.index.tolist()
        
        # Prepare data for prediction
        # The model might fail if there are extra columns (like Student ID or Target)
        predict_df = df.copy()
        if "Student ID" in predict_df.columns:
            predict_df = predict_df.drop(columns=["Student ID"])
        if "Target" in predict_df.columns:
            predict_df = predict_df.drop(columns=["Target"])
            
        # Optional: check if expected features match
        expected_features = getattr(predictor_model, 'feature_names_in_', None)
        if expected_features is not None:
            # Keep only the expected features, handle missing with 0 or default if needed
            missing_cols = [col for col in expected_features if col not in predict_df.columns]
            for col in missing_cols:
                predict_df[col] = 0 # Default fallback, though user should provide complete CSV
            predict_df = predict_df[expected_features]
            
        numerical_preds = predictor_model.predict(predict_df)
        text_predictions = target_encoder.inverse_transform(numerical_preds)
        probabilities = predictor_model.predict_proba(predict_df)
        
        results = []
        for i in range(len(df)):
            class_probs = {target_encoder.classes_[j]: float(probabilities[i][j]) for j in range(len(target_encoder.classes_))}
            results.append({
                "identifier": identifiers[i],
                "prediction": text_predictions[i],
                "confidence_scores": class_probs
            })
            
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

# Endpoint 3: EDA Data for Momentum
@app.get("/api/eda/momentum")
def get_momentum():
    df = pd.read_csv("studentdropout.csv")
    res = df[["Curricular units 1st sem (approved)", "Curricular units 2nd sem (approved)", "Target"]].copy()
    res.rename(columns={
        "Curricular units 1st sem (approved)": "sem1",
        "Curricular units 2nd sem (approved)": "sem2",
        "Target": "target"
    }, inplace=True)
    return res.to_dict(orient="records")

# Endpoint 4: EDA Data for Age vs Course
@app.get("/api/eda/age_course")
def get_age_course():
    df = pd.read_csv("studentdropout.csv")
    res = df[["Course", "Age at enrollment", "Target"]].copy()
    res.rename(columns={
        "Course": "course",
        "Age at enrollment": "age",
        "Target": "target"
    }, inplace=True)
    return res.to_dict(orient="records")

# Endpoint 5: EDA Data for Mother's Qualification
@app.get("/api/eda/mother_qual")
def get_mother_qual():
    df = pd.read_csv("studentdropout.csv")
    qual_df = df.groupby("Mother's qualification")['Target'].value_counts(normalize=True).unstack().fillna(0)
    if 'Dropout' in qual_df.columns:
        qual_df = qual_df.reset_index()
        res = qual_df[["Mother's qualification", "Dropout"]].copy()
        res.rename(columns={
            "Mother's qualification": "qualification",
            "Dropout": "dropout_rate"
        }, inplace=True)
        return res.to_dict(orient="records")
    return []