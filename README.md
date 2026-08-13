# 🎓 AI Student Retention Engine & Dropout Predictor

An advanced, AI-driven web application and machine learning pipeline designed to predict and analyze student dropout risk. By leveraging robust machine learning ensembles and interactive visualizations, this platform empowers educational institutions, counselors, and administrators to identify at-risk students early and implement targeted interventions.

## 🌟 Key Features

- **Deep Learning / Ensemble ML Pipeline**: Utilizes a highly accurate Voting Classifier (incorporating CatBoost, XGBoost, and Random Forest) to predict student outcomes (Graduate, Enrolled, or Dropout).
- **Interactive Explainable AI (XAI)**: Integrates SHAP (SHapley Additive exPlanations) to provide interactive, feature-level transparency into *why* a model made a specific prediction.
- **Class Imbalance Handling**: Uses ADASYN (Adaptive Synthetic Sampling) in the ML pipeline to ensure the model accurately predicts minority classes.
- **Role-Based Portals**:
  - **Admin / Counselor Dashboard**: Predict individual student outcomes, batch process student data, and view macroeconomic & demographic EDA (Exploratory Data Analysis).
  - **Student Portal**: Provides students with transparency into their academic trajectory and personalized guidance.
- **Stunning UI/UX**: Built with React, Vite, and Lucide Icons, featuring glassmorphism design, fluid animations, and a seamless dark/light mode toggle.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast frontend development.
- **Recharts**: For interactive data visualization (SHAP impact charts, EDA macros).
- **Lucide React**: Beautiful, consistent iconography.
- **CSS3**: Custom glassmorphism, glowing effects, and responsive design (`index.css`).

### Backend & ML Pipeline
- **FastAPI**: High-performance asynchronous Python backend.
- **Scikit-Learn, XGBoost, CatBoost**: Core machine learning libraries for the Voting Classifier.
- **SHAP**: For surrogate model explainability.
- **Pandas & NumPy**: For data wrangling and preprocessing.
- **Uvicorn**: ASGI server for running the FastAPI application.

## 📁 Project Structure

```text
Student_dropout/
├── frontend/                 # React (Vite) Frontend Application
│   ├── src/                  # React Components (Dashboard, PredictionPortal, etc.)
│   ├── public/               # Static assets and demo datasets
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
├── landing_page/             # Static HTML/CSS landing page
├── exported_assets/          # Serialized ML models (joblib/pkl)
│   ├── voting_classifier.pkl
│   ├── surrogate_xgb.pkl
│   └── shap_explainer.pkl
├── main.py                   # FastAPI backend application
├── drop_predict.ipynb        # Jupyter Notebook with the end-to-end ML pipeline and ADASYN
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Student_dropout
```

### 2. Backend Setup (FastAPI)
It is recommended to use a Python virtual environment.
```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install required Python packages
pip install fastapi uvicorn pandas numpy scikit-learn xgboost catboost shap joblib python-multipart

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000` and the interactive docs at `http://localhost:8000/docs`.*

### 3. Frontend Setup (React/Vite)
Open a new terminal window/tab:
```bash
cd frontend

# Install Node dependencies
npm install

# Start the React development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

## 🧠 Machine Learning Pipeline Highlights

The heart of this application is the `drop_predict.ipynb` notebook, which details the end-to-end data science workflow:
1. **Data Preprocessing**: Handling missing values, encoding categorical variables (Target Encoding), and scaling numerical features.
2. **ADASYN Resampling**: Addressing the inherent class imbalance in educational dropout datasets to prevent model bias toward the majority class.
3. **Model Training & Evaluation**: Training multiple models (CatBoost, Random Forest, XGBoost) and combining them into a powerful Voting Classifier.
4. **Surrogate Modeling**: Training an XGBoost surrogate on the ensemble's predictions to generate lightning-fast SHAP values for the web application in real-time.

---
*Built with ❤️ for educational innovation.*
