import streamlit as st
import requests
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

# --- PAGE CONFIGURATION ---
st.set_page_config(page_title="Predictive Analytics Portal", page_icon="🎓", layout="wide", initial_sidebar_state="expanded")

# --- SESSION STATE INITIALIZATION (LOGIN TRACKING) ---
if 'logged_in' not in st.session_state:
    st.session_state['logged_in'] = False
if 'user_role' not in st.session_state:
    st.session_state['user_role'] = None
if 'username' not in st.session_state:
    st.session_state['username'] = None

# --- THEME TOGGLE (LIGHT/DARK MODE) ---
st.sidebar.markdown("### 🎨 Theme Settings")
dark_mode = st.sidebar.toggle("🌙 Enable Dark Mode", value=True)

# --- DYNAMIC CSS INJECTION (Including Login Box Styling) ---
if dark_mode:
    theme_css = """
    <style>
        .stApp { background-color: #0a0a0f; color: #e2e8f0; font-family: 'Inter', sans-serif; }
        div.css-1r6slb0, div.css-12oz5g7, .login-box {
            background: rgba(20, 20, 30, 0.6); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5); padding: 30px;
        }
        .stButton>button { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; border-radius: 12px; padding: 12px 24px; font-weight: bold; border: none; width: 100%; transition: all 0.3s ease; box-shadow: 0 10px 20px -5px rgba(168, 85, 247, 0.5); }
        .stButton>button:hover { transform: translateY(-4px); box-shadow: 0 20px 30px -5px rgba(168, 85, 247, 0.7); }
        h1, h2, h3 { background: -webkit-linear-gradient(45deg, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-box { background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    </style>
    """
else:
    theme_css = """
    <style>
        .stApp { background-color: #f8fafc; color: #334155; font-family: 'Inter', sans-serif; }
        div.css-1r6slb0, div.css-12oz5g7, .login-box {
            background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 30px;
        }
        .stButton>button { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; border-radius: 12px; padding: 12px 24px; font-weight: bold; border: none; width: 100%; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .stButton>button:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
        h1, h2, h3 { color: #1e293b; font-weight: 800; }
        .hero-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; color: #1e3a8a;}
    </style>
    """
st.markdown(theme_css, unsafe_allow_html=True)

# API ENDPOINTS
PREDICT_URL = "http://127.0.0.1:8000/predict"
EXPLAIN_URL = "http://127.0.0.1:8000/explain"

# ==========================================
# LOGIN SCREEN LOGIC
# ==========================================
if not st.session_state['logged_in']:
    st.markdown("<h1 style='text-align: center; margin-top: 50px;'>🎓 University Analytics Portal</h1>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 1.5, 1])
    with col2:
        st.markdown("<div class='login-box'>", unsafe_allow_html=True)
        st.markdown("### Secure Login")
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        
        if st.button("Authenticate"):
            if username == "admin" and password == "admin123":
                st.session_state['logged_in'] = True
                st.session_state['user_role'] = "Admin"
                st.session_state['username'] = "Dean of Engineering"
                st.rerun()
            elif username == "counselor" and password == "staff123":
                st.session_state['logged_in'] = True
                st.session_state['user_role'] = "Counselor"
                st.session_state['username'] = "Academic Counselor"
                st.rerun()
            else:
                st.error("Invalid credentials. Please try again.")
        st.markdown("</div>", unsafe_allow_html=True)
        st.caption("Test Accounts -> Admin: admin/admin123 | Counselor: counselor/staff123")

# ==========================================
# MAIN APPLICATION (Only runs if logged in)
# ==========================================
else:
    # Sidebar Profile & Logout
    st.sidebar.markdown(f"### 👤 {st.session_state['username']}")
    st.sidebar.markdown(f"**Role:** {st.session_state['user_role']}")
    if st.sidebar.button("Log Out"):
        st.session_state['logged_in'] = False
        st.session_state['user_role'] = None
        st.rerun()
        
    st.title("🎓 AI Student Retention Engine")

    # --- ROLE-BASED TAB ROUTING ---
    if st.session_state['user_role'] == "Admin":
        tab_guide, tab_single, tab_eda, tab_batch = st.tabs(["📖 Welcome & Guide", "👤 Single Student Analysis", "📊 Macro Insights", "📁 College CSV Bulk Upload"])
    else:
        tab_guide, tab_single, tab_eda = st.tabs(["📖 Welcome & Guide", "👤 Single Student Analysis", "📊 Macro Insights"])

    # ==========================================
    # TAB 1: HERO SECTION & DATA DICTIONARY
    # ==========================================
    with tab_guide:
        st.markdown("""
        <div class="hero-box">
            <h3>Welcome to the Predictive Analytics Portal</h3>
            <p>This application utilizes an advanced Machine Learning Ensemble (Voting Classifier + XGBoost Surrogate) to predict student dropout risk. 
            It analyzes a combination of <b>Demographic</b>, <b>Academic</b>, and <b>Macroeconomic</b> factors to provide actionable intelligence for university administrators.</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("### 📚 Data Dictionary & Encoding Guide")
        st.write("Use the comprehensive table below to understand the exact encoded values required for the AI model. You can sort and search through all 34 parameters.")
        
        data_dictionary = pd.DataFrame([
            {"Feature": "Marital status", "Values": "1: Single, 2: Married, 3: Widower, 4: Divorced, 5: Facto union, 6: Legally separated"},
            {"Feature": "Nationality", "Values": "1: Portuguese, 2: German, 3: Spanish, 4: Italian, 5: Dutch, 6: English, 7: Lithuanian, 8: Angolan, 9: Cape Verdean, 10: Guinean, 11: Mozambican, 12: Santomean, 13: Turkish, 14: Brazilian, 15: Romanian, 16: Moldova, 17: Mexican, 18: Ukrainian, 19: Russian, 20: Cuban, 21: Colombian"},
            {"Feature": "Application mode", "Values": "1: 1st phase (general), 2: Ordinance 612/93, 3: 1st phase (special Azores), 4: Holders of other higher courses, 5: Ordinance 854-B/99, 6: International student, 7: 1st phase (special Madeira), 8: 2nd phase (general), 9: 3rd phase (general), 10: Ordinance 533-A/99 b2, 11: Ordinance 533-A/99 b3, 12: Over 23 years, 13: Transfer, 14: Change in course, 15: Tech specialization diploma, 16: Change institution/course, 17: Short cycle diploma, 18: Change institution/course (Intl)"},
            {"Feature": "Course", "Values": "1: Biofuel, 2: Animation/Multimedia, 3: Social Service (evening), 4: Agronomy, 5: Communication Design, 6: Veterinary Nursing, 7: Informatics Engineering, 8: Equiniculture, 9: Management, 10: Social Service, 11: Tourism, 12: Nursing, 13: Oral Hygiene, 14: Advertising/Marketing, 15: Journalism/Communication, 16: Basic Education, 17: Management (evening)"},
            {"Feature": "Previous qualification", "Values": "1: Secondary, 2: Bachelors, 3: Degree, 4: Masters, 5: Doctorate, 6: Freq. of higher ed, 7-11: Various incomplete schooling, 12-13: Basic education cycles, 14: Tech specialization, 15: Higher ed degree (1st cycle), 16: Prof. higher tech course, 17: Masters (2nd cycle)"},
            {"Feature": "Mother's & Father's qualification", "Values": "1-6: Higher Education levels, 7-23: Various Secondary/Basic/Technical education levels, 24: Unknown, 25-26: Illiterate/Cannot read, 27-34: Advanced tech/degree cycles"},
            {"Feature": "Mother's & Father's occupation", "Values": "1: Student, 2-6: Directors/Specialists/Admin, 7-10: Agriculture/Industry/Unskilled, 11-16: Armed Forces, 17-46: Specific categorical professions (Health, Teaching, Tech, Security, Transport, etc.)"},
            {"Feature": "Gender", "Values": "1: Male, 0: Female"},
            {"Feature": "Daytime/evening attendance", "Values": "1: Daytime, 0: Evening"},
            {"Feature": "Displaced", "Values": "1: Yes, 0: No"},
            {"Feature": "Educational special needs", "Values": "1: Yes, 0: No"},
            {"Feature": "Debtor", "Values": "1: Yes, 0: No"},
            {"Feature": "Tuition fees up to date", "Values": "1: Yes, 0: No"},
            {"Feature": "Scholarship holder", "Values": "1: Yes, 0: No"},
            {"Feature": "International", "Values": "1: Yes, 0: No"},
            {"Feature": "Curricular units (All)", "Values": "Numerical count of units credited, enrolled, evaluated, and approved per semester"},
            {"Feature": "Curricular grades (All)", "Values": "Numerical grade average (0 to 20 scale)"},
            {"Feature": "Macroeconomics (GDP, Inflation, Unemployment)", "Values": "Numerical percentages reflecting national economic status at time of enrollment"}
        ])
        
        st.dataframe(data_dictionary, use_container_width=True, hide_index=True, height=600)

    # ==========================================
    # TAB 2: SINGLE STUDENT PREDICTION
    # ==========================================
    with tab_single:
        st.markdown("### Input Student Parameters")
        
        with st.expander("Expand to enter student details manually", expanded=True):
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.caption("Demographics")
                marital = st.number_input("Marital status", value=1, key="m1")
                nationality = st.number_input("Nacionality", value=1, key="n1")
                gender = st.selectbox("Gender", [0, 1], key="g1")
                age = st.number_input("Age at enrollment", value=20, key="a1")
                displaced = st.selectbox("Displaced", [0, 1], key="d1")
                m_qual = st.number_input("Mother's qualification", value=1)
                f_qual = st.number_input("Father's qualification", value=1)
                m_occ = st.number_input("Mother's occupation", value=1)
                f_occ = st.number_input("Father's occupation", value=1)

            with col2:
                st.caption("Enrollment")
                app_mode = st.number_input("Application mode", value=1)
                app_order = st.number_input("Application order", value=1)
                course = st.number_input("Course", value=1)
                attendance = st.selectbox("Daytime/evening attendance", [0, 1])
                prev_qual = st.number_input("Previous qualification", value=1)
                special_needs = st.selectbox("Special needs", [0, 1])
                debtor = st.selectbox("Debtor", [0, 1])
                tuition = st.selectbox("Tuition fees up to date", [1, 0])
                scholarship = st.selectbox("Scholarship holder", [0, 1])
                international = st.selectbox("International", [0, 1])

            with col3:
                st.caption("Sem 1 Academic")
                c1_cred = st.number_input("Sem 1 (credited)", value=0)
                c1_enr = st.number_input("Sem 1 (enrolled)", value=0)
                c1_eval = st.number_input("Sem 1 (evaluations)", value=0)
                c1_appr = st.number_input("Sem 1 (approved)", value=0)
                c1_grade = st.number_input("Sem 1 (grade)", value=0.0)
                c1_no_eval = st.number_input("Sem 1 (without eval)", value=0)

            with col4:
                st.caption("Sem 2 & Economics")
                c2_cred = st.number_input("Sem 2 (credited)", value=0)
                c2_enr = st.number_input("Sem 2 (enrolled)", value=0)
                c2_eval = st.number_input("Sem 2 (evaluations)", value=0)
                c2_appr = st.number_input("Sem 2 (approved)", value=0)
                c2_grade = st.number_input("Sem 2 (grade)", value=0.0)
                c2_no_eval = st.number_input("Sem 2 (without eval)", value=0)
                unemployment = st.number_input("Unemployment rate (%)", value=10.8)
                inflation = st.number_input("Inflation rate", value=1.4)
                gdp = st.number_input("GDP", value=1.7)

        st.markdown("<br>", unsafe_allow_html=True)

        if st.button("🚀 Initialize AI Analysis"):
            student_data = {
                "Marital status": float(marital), "Application mode": float(app_mode), "Application order": float(app_order),
                "Course": float(course), "Daytime/evening attendance": float(attendance), "Previous qualification": float(prev_qual),
                "Nacionality": float(nationality), "Mother's qualification": float(m_qual), "Father's qualification": float(f_qual),
                "Mother's occupation": float(m_occ), "Father's occupation": float(f_occ), "Displaced": float(displaced),
                "Educational special needs": float(special_needs), "Debtor": float(debtor), "Tuition fees up to date": float(tuition),
                "Gender": float(gender), "Scholarship holder": float(scholarship), "Age at enrollment": float(age),
                "International": float(international), "Curricular units 1st sem (credited)": float(c1_cred),
                "Curricular units 1st sem (enrolled)": float(c1_enr), "Curricular units 1st sem (evaluations)": float(c1_eval),
                "Curricular units 1st sem (approved)": float(c1_appr), "Curricular units 1st sem (grade)": float(c1_grade),
                "Curricular units 1st sem (without evaluations)": float(c1_no_eval), "Curricular units 2nd sem (credited)": float(c2_cred),
                "Curricular units 2nd sem (enrolled)": float(c2_enr), "Curricular units 2nd sem (evaluations)": float(c2_eval),
                "Curricular units 2nd sem (approved)": float(c2_appr), "Curricular units 2nd sem (grade)": float(c2_grade),
                "Curricular units 2nd sem (without evaluations)": float(c2_no_eval), "Unemployment rate": float(unemployment),
                "Inflation rate": float(inflation), "GDP": float(gdp)
            }
            
            with st.spinner("Processing deep learning ensemble..."):
                try:
                    pred_response = requests.post(PREDICT_URL, json=student_data)
                    exp_response = requests.post(EXPLAIN_URL, json=student_data)
                    
                    if pred_response.status_code == 200 and exp_response.status_code == 200:
                        result = pred_response.json()
                        explanation = exp_response.json()
                        
                        prediction = result["prediction"]
                        conf = result["confidence_scores"]
                        shap_vals = explanation["shap_values"]
                        features = explanation["features"]
                        
                        st.markdown("---")
                        rc1, rc2 = st.columns([1, 2])
                        
                        with rc1:
                            bg_color = "#1a1a24" if dark_mode else "#ffffff"
                            if prediction == "Graduate":
                                color, glow = "#10b981", "rgba(16, 185, 129, 0.4)"
                                icon = "🎓"
                            elif prediction == "Enrolled":
                                color, glow = "#3b82f6", "rgba(59, 130, 246, 0.4)"
                                icon = "🔄"
                            else:
                                color, glow = "#ef4444", "rgba(239, 68, 68, 0.4)"
                                icon = "⚠️"
                                
                            st.markdown(f"""
                            <div style='background-color: {bg_color}; padding: 30px; border-radius: 15px; 
                                        border: 2px solid {color}; box-shadow: 0 0 20px {glow}; text-align: center;'>
                                <h1 style='font-size: 50px; margin: 0;'>{icon}</h1>
                                <h2 style='color: {color}; margin: 10px 0;'>{prediction.upper()}</h2>
                                <p style='color: #94a3b8;'>Model Confidence: {max(conf.values())*100:.1f}%</p>
                            </div>
                            """, unsafe_allow_html=True)
                            
                            st.markdown("<br>", unsafe_allow_html=True)
                            st.write("**Probability Distribution**")
                            st.progress(conf.get('Graduate', 0), text=f"Graduate ({conf.get('Graduate', 0)*100:.1f}%)")
                            st.progress(conf.get('Dropout', 0), text=f"Dropout ({conf.get('Dropout', 0)*100:.1f}%)")
                            
                            # --- AI REASONING TEXT ---
                            st.markdown("<br>### 🧠 AI Reasoning", unsafe_allow_html=True)
                            impacts = list(zip(features, shap_vals))
                            impacts.sort(key=lambda x: abs(x[1]), reverse=True)
                            top_pos = [i[0] for i in impacts if i[1] > 0][:2]
                            top_neg = [i[0] for i in impacts if i[1] < 0][:2]
                            
                            reason_text = f"The model concluded **{prediction}** primarily because "
                            if top_pos:
                                reason_text += f"**{top_pos[0]}** and **{top_pos[1] if len(top_pos)>1 else ''}** strongly pushed the prediction higher. "
                            if top_neg:
                                reason_text += f"However, factors like **{top_neg[0]}** acted as negative constraints."
                                
                            st.info(reason_text)

                            # --- ACTIONABLE INTERVENTION ENGINE ---
                            if prediction == "Dropout":
                                st.markdown("<br>### 🎯 Prescribed Interventions", unsafe_allow_html=True)
                                
                                interventions = []
                                for feature in top_neg:
                                    if "Tuition fees" in feature:
                                        interventions.append("💰 **Financial Alert:** Student has outstanding tuition. Route to Financial Aid Office immediately.")
                                    elif "grade" in feature.lower() or "approved" in feature.lower() or "evaluations" in feature.lower():
                                        interventions.append("📚 **Academic Alert:** Poor performance in Curricular Units. Schedule peer-mentoring or tutoring.")
                                    elif "Debtor" in feature:
                                        interventions.append("🏦 **Debt Alert:** Student is flagged as a debtor. Schedule financial planning consultation.")
                                    elif "Unemployment" in feature or "GDP" in feature or "Inflation" in feature:
                                        interventions.append("🌍 **Macroeconomic Risk:** External economic pressure detected. Offer work-study programs.")
                                
                                if len(interventions) == 0:
                                    interventions.append("📞 **General Alert:** Schedule a check-in meeting with an academic counselor.")
                                    
                                for action in interventions:
                                    st.warning(action)
        
                        with rc2:
                            # --- PLOTLY CHART ---
                            st.markdown("### Interactive Impact Analysis")
                            
                            top_impacts = impacts[:12]
                            top_impacts.reverse() 
                            c_features = [x[0] for x in top_impacts]
                            c_vals = [x[1] for x in top_impacts]
                            
                            text_color = '#e2e8f0' if dark_mode else '#1e293b'
                            
                            fig = go.Figure(go.Waterfall(
                                name = "Impact", orientation = "h",
                                measure = ["relative"] * len(c_features),
                                y = c_features, x = c_vals,
                                textposition = "outside",
                                text = [f"{v:+.2f}" for v in c_vals],
                                connector = {"line":{"color":"rgba(150,150,150,0.2)"}},
                                increasing = {"marker":{"color":"#10b981"}},
                                decreasing = {"marker":{"color":"#ef4444"}}
                            ))
                            
                            fig.update_layout(
                                title="How each feature contributed to the final decision",
                                waterfallgap=0.2,
                                plot_bgcolor='rgba(0,0,0,0)',
                                paper_bgcolor='rgba(0,0,0,0)',
                                font=dict(color=text_color),
                                margin=dict(l=20, r=20, t=40, b=20),
                                height=500
                            )
                            
                            st.plotly_chart(fig, use_container_width=True)
                except Exception as e:
                    st.error("🚨 Cannot connect to the backend! Ensure FastAPI is running.")

    # ==========================================
    # TAB 3: MACROECONOMIC INSIGHTS (EDA)
    # ==========================================
    # ==========================================
    # TAB 3: COMPREHENSIVE DEMOGRAPHIC & MACRO INSIGHTS (EDA)
    # ==========================================
    with tab_eda:
        st.markdown("### 📊 Comprehensive Feature Analysis & Insights")
        st.write("Explore the interactive relational diagrams below to understand the key drivers of student retention based on the historical dataset.")
        
        text_color = '#e2e8f0' if dark_mode else '#1e293b'
        
        try:
            # Dynamically load the dataset for real-time charting
            df_eda = pd.read_csv("studentdropout.csv")
            
            # --- CHART 1: ACADEMIC MOMENTUM (1st Sem vs 2nd Sem) ---
            st.markdown("#### 1. Academic Momentum: 1st Sem vs 2nd Sem Approved Units")
            fig1 = px.scatter(
                df_eda, 
                x="Curricular units 1st sem (approved)", 
                y="Curricular units 2nd sem (approved)", 
                color="Target",
                color_discrete_map={"Graduate": "#10b981", "Dropout": "#ef4444", "Enrolled": "#3b82f6"},
                opacity=0.6,
                title="Correlation of Academic Success Across Semesters"
            )
            fig1.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font=dict(color=text_color))
            st.markdown("<div class='css-12oz5g7'>", unsafe_allow_html=True)
            st.plotly_chart(fig1, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)
            st.caption("Insight: A strong linear cluster in the top right (green) indicates high graduation probability for students maintaining momentum, while the bottom left (red) shows early academic failure strongly correlates with dropping out.")
            
            st.markdown("<br>", unsafe_allow_html=True)

            # --- CHART 2: AGE & COURSE JOINT IMPACT ---
            st.markdown("#### 2. Joint Impact: Age at Enrollment by Course")
            fig2 = px.box(
                df_eda, 
                x="Course", 
                y="Age at enrollment", 
                color="Target",
                color_discrete_map={"Graduate": "#10b981", "Dropout": "#ef4444", "Enrolled": "#3b82f6"},
                title="Age Distribution Across Courses by Student Outcome"
            )
            fig2.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font=dict(color=text_color))
            st.markdown("<div class='css-12oz5g7'>", unsafe_allow_html=True)
            st.plotly_chart(fig2, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)
            st.caption("Insight: Older students (higher age at enrollment) often show a higher density in the 'Dropout' category across several specific courses, indicating a need for non-traditional student support.")

            st.markdown("<br>", unsafe_allow_html=True)
            
            # --- CHART 3: MOTHER'S QUALIFICATION ---
            st.markdown("#### 3. Influence of Parental Education (Mother's Qualification)")
            # Calculate dropout rates
            qual_df = df_eda.groupby("Mother's qualification")['Target'].value_counts(normalize=True).unstack().fillna(0)
            if 'Dropout' in qual_df.columns:
                qual_df = qual_df.reset_index()
                fig3 = px.bar(
                    qual_df, 
                    x="Mother's qualification", 
                    y="Dropout",
                    title="Dropout Probability by Mother's Qualification Level",
                    labels={"Dropout": "Dropout Rate", "Mother's qualification": "Mother's Qual. Code"},
                    color_discrete_sequence=['#f97316']
                )
                fig3.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font=dict(color=text_color))
                st.markdown("<div class='css-12oz5g7'>", unsafe_allow_html=True)
                st.plotly_chart(fig3, use_container_width=True)
                st.markdown("</div>", unsafe_allow_html=True)
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            # --- CHART 4: ORIGINAL MACROECONOMICS CHART ---
            st.markdown("#### 4. Combined Effect of Unemployment & GDP on Dropout Risk")
            scenarios = ["High Unemp & Neg GDP", "High Unemp & Pos GDP", "Low Unemp & Neg GDP", "Low Unemp & Pos GDP"]
            dropout_rates = [0.344, 0.329, 0.285, 0.282]
            fig4 = go.Figure(data=[
                go.Bar(
                    x=scenarios, y=dropout_rates, text=[f"{val*100:.1f}%" for val in dropout_rates],
                    textposition='auto', textfont=dict(color='white', size=14, family='Inter', weight='bold'),
                    marker=dict(color=['#ef4444', '#f97316', '#eab308', '#3b82f6'], line=dict(width=0))
                )
            ])
            fig4.update_layout(
                xaxis_title="Economic Scenario", yaxis_title="Historical Dropout Probability",
                yaxis_tickformat='.0%', yaxis=dict(range=[0, 0.45]), hovermode="x unified",
                plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font=dict(color=text_color),
                margin=dict(l=20, r=20, t=40, b=20), height=400
            )
            st.markdown("<div class='css-12oz5g7'>", unsafe_allow_html=True)
            st.plotly_chart(fig4, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)

        except FileNotFoundError:
            st.error("⚠️ Data connection failed: Ensure 'studentdropout.csv' is in the same folder as dashboard.py to load dynamic charts.")
    # ==========================================
    # TAB 4: CSV BULK UPLOAD (Admin Only)
    # ==========================================
    if st.session_state['user_role'] == "Admin":
        with tab_batch:
            st.markdown("### College Batch Processing")
            st.write("Upload a CSV file containing multiple student records to generate predictions for the entire cohort at once.")
            
            uploaded_file = st.file_uploader("Upload Student Data (CSV format)", type=['csv'])
            
            if uploaded_file is not None:
                df = pd.read_csv(uploaded_file)
                st.write("Preview of uploaded data:")
                st.dataframe(df.head(5))
                
                if st.button("🚀 Process Entire Batch"):
                    progress_bar = st.progress(0, text="Initializing batch processing...")
                    predictions = []
                    
                    for index, row in df.iterrows():
                        row_data = row.to_dict()
                        try:
                            resp = requests.post(PREDICT_URL, json=row_data)
                            if resp.status_code == 200:
                                predictions.append(resp.json()["prediction"])
                            else:
                                predictions.append("Error")
                        except:
                            predictions.append("API Connection Failed")
                            
                        progress = int(((index + 1) / len(df)) * 100)
                        progress_bar.progress(progress, text=f"Processing student {index + 1} of {len(df)}...")
                    
                    df["AI_Predicted_Outcome"] = predictions
                    st.success("Batch processing complete!")
                    
                    def color_rows(row):
                        if row['AI_Predicted_Outcome'] == 'Graduate': return ['background-color: rgba(16, 185, 129, 0.2)'] * len(row)
                        elif row['AI_Predicted_Outcome'] == 'Dropout': return ['background-color: rgba(239, 68, 68, 0.2)'] * len(row)
                        return ['background-color: rgba(59, 130, 246, 0.2)'] * len(row)
                        
                    st.dataframe(df.style.apply(color_rows, axis=1))
                    
                    csv = df.to_csv(index=False).encode('utf-8')
                    st.download_button("📥 Download Results CSV", data=csv, file_name="batch_predictions.csv", mime="text/csv")