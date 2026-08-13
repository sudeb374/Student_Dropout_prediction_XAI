import { useState, useEffect } from 'react';
import { Rocket, Activity, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  MARITAL_STATUS_MAPPING,
  NATIONALITY_MAPPING,
  APPLICATION_MODE_MAPPING,
  COURSE_MAPPING,
  PREVIOUS_QUALIFICATION_MAPPING,
  PARENTS_QUALIFICATION_MAPPING,
  OCCUPATION_MAPPING,
  GENDER_MAPPING,
  DAYTIME_EVENING_MAPPING,
  DISPLACED_MAPPING,
  EDUCATIONAL_SPECIAL_NEEDS_MAPPING,
  DEBTOR_MAPPING,
  TUITION_FEES_UP_TO_DATE_MAPPING,
  SCHOLARSHIP_HOLDER_MAPPING,
  INTERNATIONAL_MAPPING
} from '../utils/mappings';

export default function PredictionPortal() {
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('predictionFormData');
    if (saved) return JSON.parse(saved);
    return {
      "Marital status": "", "Application mode": "", "Application order": 1, "Course": "",
      "Daytime/evening attendance": "", "Previous qualification": "", "Nacionality": "",
      "Mother's qualification": "", "Father's qualification": "", "Mother's occupation": "",
      "Father's occupation": "", "Displaced": "", "Educational special needs": "",
      "Debtor": "", "Tuition fees up to date": "", "Gender": "", "Scholarship holder": "",
      "Age at enrollment": 20, "International": "",
      "Curricular units 1st sem (credited)": 0, "Curricular units 1st sem (enrolled)": 0,
      "Curricular units 1st sem (evaluations)": 0, "Curricular units 1st sem (approved)": 0,
      "Curricular units 1st sem (grade)": 0, "Curricular units 1st sem (without evaluations)": 0,
      "Curricular units 2nd sem (credited)": 0, "Curricular units 2nd sem (enrolled)": 0,
      "Curricular units 2nd sem (evaluations)": 0, "Curricular units 2nd sem (approved)": 0,
      "Curricular units 2nd sem (grade)": 0, "Curricular units 2nd sem (without evaluations)": 0,
      "Unemployment rate": 10.8, "Inflation rate": 1.4, "GDP": 1.7
    };
  });

  useEffect(() => {
    sessionStorage.setItem('predictionFormData', JSON.stringify(formData));
  }, [formData]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === "" ? "" : Number(value)
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError('');

    const missingFields = Object.entries(formData)
      .filter(([key, val]) => val === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please complete all fields before predicting. Select an option for: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }
    try {
      const pRes = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const eRes = await fetch('http://127.0.0.1:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!pRes.ok || !eRes.ok) throw new Error('Failed to connect to backend. Is the server running?');
      
      const predictionData = await pRes.json();
      const explanationData = await eRes.json();

      setResult({
        prediction: predictionData.prediction,
        confidence: predictionData.confidence_scores,
        shap: explanationData
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (f) => {
    let mapping = null;
    switch(f) {
      case 'Marital status': mapping = MARITAL_STATUS_MAPPING; break;
      case 'Nacionality': mapping = NATIONALITY_MAPPING; break;
      case "Mother's qualification":
      case "Father's qualification": mapping = PARENTS_QUALIFICATION_MAPPING; break;
      case "Mother's occupation":
      case "Father's occupation": mapping = OCCUPATION_MAPPING; break;
      case 'Application mode': mapping = APPLICATION_MODE_MAPPING; break;
      case 'Course': mapping = COURSE_MAPPING; break;
      case 'Previous qualification': mapping = PREVIOUS_QUALIFICATION_MAPPING; break;
      case 'Daytime/evening attendance': mapping = DAYTIME_EVENING_MAPPING; break;
      case 'Educational special needs': mapping = EDUCATIONAL_SPECIAL_NEEDS_MAPPING; break;
      case 'Debtor': mapping = DEBTOR_MAPPING; break;
      case 'Tuition fees up to date': mapping = TUITION_FEES_UP_TO_DATE_MAPPING; break;
      case 'Scholarship holder': mapping = SCHOLARSHIP_HOLDER_MAPPING; break;
      case 'International': mapping = INTERNATIONAL_MAPPING; break;
      case 'Gender': mapping = GENDER_MAPPING; break;
      case 'Displaced': mapping = DISPLACED_MAPPING; break;
    }

    if (mapping) {
      return (
        <select name={f} value={formData[f]} onChange={handleChange} className="input-field">
          <option value="" disabled>Select</option>
          {Object.entries(mapping).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      );
    }

    return <input type="number" name={f} value={formData[f]} onChange={handleChange} className="input-field" />;
  };

  const renderInterventions = (prediction, shap) => {
    if (prediction !== "Dropout") return null;
    
    let impacts = shap.features.map((f, i) => ({ feature: f, value: shap.shap_values[i] }));
    impacts.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const top_neg = impacts.filter(x => x.value < 0).slice(0, 3).map(x => x.feature);

    const interventions = [];
    top_neg.forEach(feature => {
      if (feature.includes("Tuition fees")) interventions.push("💰 Financial Alert: Student has outstanding tuition. Route to Financial Aid Office.");
      else if (feature.toLowerCase().includes("grade") || feature.toLowerCase().includes("approved") || feature.toLowerCase().includes("evaluations"))
        interventions.push("📚 Academic Alert: Poor performance. Schedule peer-mentoring or tutoring.");
      else if (feature.includes("Debtor")) interventions.push("🏦 Debt Alert: Student is flagged as a debtor. Schedule financial planning.");
      else if (feature.includes("Unemployment") || feature.includes("GDP") || feature.includes("Inflation"))
        interventions.push("🌍 Macroeconomic Risk: External economic pressure detected. Offer work-study programs.");
    });

    if (interventions.length === 0) interventions.push("📞 General Alert: Schedule a check-in meeting with an academic counselor.");

    return (
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning-color)' }}>
          <AlertTriangle size={20} /> Prescribed Interventions
        </h3>
        {interventions.map((inv, idx) => (
          <div key={idx} style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--warning-color)', padding: '12px', marginBottom: '10px', borderRadius: '0 8px 8px 0', fontSize: '0.9rem' }}>
            {inv}
          </div>
        ))}
      </div>
    );
  };

  const academicLabels = {
    'credited': 'Credit Transfer Subjects',
    'enrolled': 'Subjects Registered',
    'evaluations': 'Assessments Attempted',
    'approved': 'Subjects Passed',
    'grade': 'Average Marks/SGPA',
    'without evaluations': 'Subjects Missed Exams In'
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 className="glowing-text" style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={24} />
          Input Student Parameters
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Demographic Details */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: 'var(--accent-color)', margin: '0 0 15px 0', fontSize: '1.2rem' }}>Demographic Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {['Marital status', 'Nacionality', 'Age at enrollment', "Mother's qualification", "Father's qualification", "Mother's occupation", "Father's occupation", 'Gender', 'Displaced'].map(f => (
                <div key={f}>
                  <label className="input-label">{f}</label>
                  {renderField(f)}
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: 'var(--accent-color)', margin: '0 0 15px 0', fontSize: '1.2rem' }}>Academic Performance</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {['Course', 'Previous qualification', 'Educational special needs'].map(f => (
                <div key={f}>
                  <label className="input-label">{f}</label>
                  {renderField(f)}
                </div>
              ))}
              {['credited', 'enrolled', 'evaluations', 'approved', 'grade', 'without evaluations'].map(ext => (
                <div key={`sem1-${ext}`}>
                  <label className="input-label">{academicLabels[ext]} (Sem 1)</label>
                  <input type="number" name={`Curricular units 1st sem (${ext})`} value={formData[`Curricular units 1st sem (${ext})`]} onChange={handleChange} className="input-field" step="any" />
                </div>
              ))}
              {['credited', 'enrolled', 'evaluations', 'approved', 'grade', 'without evaluations'].map(ext => (
                <div key={`sem2-${ext}`}>
                  <label className="input-label">{academicLabels[ext]} (Sem 2)</label>
                  <input type="number" name={`Curricular units 2nd sem (${ext})`} value={formData[`Curricular units 2nd sem (${ext})`]} onChange={handleChange} className="input-field" step="any" />
                </div>
              ))}
            </div>
          </div>

          {/* Financial & Enrollment Details */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: 'var(--accent-color)', margin: '0 0 15px 0', fontSize: '1.2rem' }}>Financial & Enrollment Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {['Application mode', 'Application order', 'Daytime/evening attendance', 'Debtor', 'Tuition fees up to date', 'Scholarship holder', 'International'].map(f => (
                <div key={f}>
                  <label className="input-label">{f}</label>
                  {renderField(f)}
                </div>
              ))}
              {['Unemployment rate', 'Inflation rate', 'GDP'].map(f => (
                <div key={f}>
                  <label className="input-label">{f}</label>
                  <input type="number" name={f} value={formData[f]} onChange={handleChange} className="input-field" step="any" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button className="glowing-button" onClick={handlePredict} disabled={loading} style={{ fontSize: '1.1rem', padding: '15px 40px' }}>
            <Rocket size={20} />
            {loading ? 'Processing Deep Learning Ensemble...' : 'Initialize AI Analysis'}
          </button>
        </div>
        
        {error && <div style={{ color: 'var(--error-color)', marginTop: '20px', textAlign: 'center' }}>🚨 {error}</div>}
      </div>

      {result && (
        <div className="glass-panel animate-fade-in delay-2" style={{ padding: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            
            {/* Left: Prediction Status */}
            <div>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '30px', 
                borderRadius: '16px', 
                textAlign: 'center',
                border: `2px solid ${result.prediction === 'Graduate' ? 'var(--success-color)' : result.prediction === 'Dropout' ? 'var(--error-color)' : 'var(--accent-color)'}`,
                boxShadow: `0 0 20px ${result.prediction === 'Graduate' ? 'rgba(16,185,129,0.3)' : result.prediction === 'Dropout' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`
              }}>
                <h1 style={{ fontSize: '50px', margin: '0 0 10px 0' }}>
                  {result.prediction === 'Graduate' ? '🎓' : result.prediction === 'Dropout' ? '⚠️' : '🔄'}
                </h1>
                <h2 style={{ 
                  margin: 0,
                  color: result.prediction === 'Graduate' ? 'var(--success-color)' : result.prediction === 'Dropout' ? 'var(--error-color)' : 'var(--accent-color)'
                }}>
                  {result.prediction.toUpperCase()}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>Model Confidence: {(Math.max(...Object.values(result.confidence)) * 100).toFixed(1)}%</p>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Probability Distribution</h4>
                {Object.entries(result.confidence).map(([cls, prob]) => (
                  <div key={cls} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>{cls}</span>
                      <span>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${prob * 100}%`, 
                        background: cls === 'Graduate' ? 'var(--success-color)' : cls === 'Dropout' ? 'var(--error-color)' : 'var(--accent-color)',
                        transition: 'width 1s ease-out'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {renderInterventions(result.prediction, result.shap)}
            </div>

            {/* Right: SHAP Impact Chart */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
                <Activity size={20} color="var(--accent-color)" /> Interactive Impact Analysis (SHAP)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                How each feature contributed to the final decision. Green pushes towards Graduate/Enrolled, Red pushes towards Dropout.
              </p>
              
              <div style={{ height: '400px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={
                      result.shap.features.map((f, i) => ({ name: f, impact: result.shap.shap_values[i] }))
                        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                        .slice(0, 10)
                    }
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      formatter={(val) => val.toFixed(3)}
                    />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {
                        result.shap.features.map((f, i) => ({ name: f, impact: result.shap.shap_values[i] }))
                          .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                          .slice(0, 10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impact > 0 ? 'var(--success-color)' : 'var(--error-color)'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
