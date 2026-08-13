import requests
import json

payload = {
    "Course": 10,
    "Age at enrollment": 19,
    "Tuition fees up to date": 1,
    "Scholarship holder": 1,
    "Curricular units 1st sem (approved)": 5,
    "Curricular units 1st sem (grade)": 7.6,
    "Curricular units 2nd sem (approved)": 6,
    "Curricular units 2nd sem (grade)": 8.2,
    "Marital status": 1, "Application mode": 1, "Application order": 1,
    "Daytime/evening attendance": 1, "Previous qualification": 1, "Nacionality": 1,
    "Mother's qualification": 1, "Father's qualification": 1, "Mother's occupation": 1,
    "Father's occupation": 1, "Displaced": 0, "Educational special needs": 0,
    "Debtor": 0, "Gender": 0, "International": 0,
    "Curricular units 1st sem (credited)": 0, "Curricular units 1st sem (enrolled)": 5,
    "Curricular units 1st sem (evaluations)": 5,
    "Curricular units 1st sem (without evaluations)": 0,
    "Curricular units 2nd sem (credited)": 0, "Curricular units 2nd sem (enrolled)": 6,
    "Curricular units 2nd sem (evaluations)": 6,
    "Curricular units 2nd sem (without evaluations)": 0,
    "Unemployment rate": 10.8, "Inflation rate": 1.4, "GDP": 1.7
}

try:
    p = requests.post('http://127.0.0.1:8000/predict', json=payload)
    print("Predict Status:", p.status_code)
    print("Predict Response:", p.text)
except Exception as e:
    print("Predict Error:", e)

try:
    e = requests.post('http://127.0.0.1:8000/explain', json=payload)
    print("Explain Status:", e.status_code)
    print("Explain Response:", e.text)
except Exception as e:
    print("Explain Error:", e)
