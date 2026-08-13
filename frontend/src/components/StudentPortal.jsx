import { useState, useEffect } from 'react';
import { Target, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  COURSE_MAPPING,
  APPLICATION_MODE_MAPPING,
  GENDER_MAPPING,
  DISPLACED_MAPPING,
  DEBTOR_MAPPING,
  TUITION_FEES_UP_TO_DATE_MAPPING,
  SCHOLARSHIP_HOLDER_MAPPING
} from '../utils/mappings';

export default function StudentPortal() {
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('studentFormData');
    if (saved) return JSON.parse(saved);
    return {
      "Course": "",
      "Age at enrollment": 20,
      "Tuition fees up to date": "",
      "Scholarship holder": "",
      "Curricular units 1st sem (approved)": 0,
      "Curricular units 1st sem (grade)": 0,
      "Curricular units 2nd sem (approved)": 0,
      "Curricular units 2nd sem (grade)": 0,
      "Debtor": "",
      "Gender": "",
      "Displaced": "",
      "Application mode": ""
    };
  });

  useEffect(() => {
    sessionStorage.setItem('studentFormData', JSON.stringify(formData));
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
    
    // Merge user input with baseline/median values for factors out of their control
    const fullPayload = {
      ...formData,
      "Marital status": 1, "Application order": 1,
      "Daytime/evening attendance": 1, "Previous qualification": 1, "Nacionality": 1,
      "Mother's qualification": 1, "Father's qualification": 1, "Mother's occupation": 1,
      "Father's occupation": 1, "Educational special needs": 0,
      "International": 0,
      "Curricular units 1st sem (credited)": 0, "Curricular units 1st sem (enrolled)": formData["Curricular units 1st sem (approved)"],
      "Curricular units 1st sem (evaluations)": formData["Curricular units 1st sem (approved)"],
      "Curricular units 1st sem (without evaluations)": 0,
      "Curricular units 2nd sem (credited)": 0, "Curricular units 2nd sem (enrolled)": formData["Curricular units 2nd sem (approved)"],
      "Curricular units 2nd sem (evaluations)": formData["Curricular units 2nd sem (approved)"],
      "Curricular units 2nd sem (without evaluations)": 0,
      "Unemployment rate": 10.8, "Inflation rate": 1.4, "GDP": 1.7
    };

    try {
      const pRes = await fetch('https://student-dropout-prediction-with-xai.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload)
      });
      const eRes = await fetch('https://student-dropout-prediction-with-xai.onrender.com/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload)
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
      case 'Course': mapping = COURSE_MAPPING; break;
      case 'Application mode': mapping = APPLICATION_MODE_MAPPING; break;
      case 'Gender': mapping = GENDER_MAPPING; break;
      case 'Displaced': mapping = DISPLACED_MAPPING; break;
      case 'Debtor': mapping = DEBTOR_MAPPING; break;
      case 'Tuition fees up to date': mapping = TUITION_FEES_UP_TO_DATE_MAPPING; break;
      case 'Scholarship holder': mapping = SCHOLARSHIP_HOLDER_MAPPING; break;
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

    return <input type="number" name={f} value={formData[f]} onChange={handleChange} className="input-field" step="any" />;
  };

  return (
    <div className="animate-fade-in">
      
      <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-color)', padding: '20px', borderRadius: '0 8px 8px 0', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={24} color="var(--accent-color)" />
          My Academic Trajectory
        </h2>
        <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Enter your current academic details to see your projected outcome for the upcoming semesters. 
          Use this tool to set targets, identify risk factors, and stay out of the "dropzone"!
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div>
            <h4 style={{ color: 'var(--accent-color)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>General Info</h4>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Course</label>
              {renderField("Course")}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Age at enrollment</label>
              {renderField("Age at enrollment")}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Tuition fees up to date</label>
              {renderField("Tuition fees up to date")}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Scholarship holder</label>
              {renderField("Scholarship holder")}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--accent-color)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>Demographics & Risk</h4>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Debtor Status</label>
              {renderField("Debtor")}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Gender</label>
              {renderField("Gender")}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Displaced</label>
              {renderField("Displaced")}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Application Mode</label>
              {renderField("Application mode")}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-color)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>Semester 1</h4>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Subjects Passed (Sem 1)</label>
              <input type="number" name="Curricular units 1st sem (approved)" value={formData["Curricular units 1st sem (approved)"]} onChange={handleChange} className="input-field" step="any" />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Average Marks/SGPA (Sem 1)</label>
              <input type="number" name="Curricular units 1st sem (grade)" value={formData["Curricular units 1st sem (grade)"]} onChange={handleChange} className="input-field" step="any" />
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-color)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>Semester 2</h4>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Subjects Passed (Sem 2)</label>
              <input type="number" name="Curricular units 2nd sem (approved)" value={formData["Curricular units 2nd sem (approved)"]} onChange={handleChange} className="input-field" step="any" />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label className="input-label">Average Marks/SGPA (Sem 2)</label>
              <input type="number" name="Curricular units 2nd sem (grade)" value={formData["Curricular units 2nd sem (grade)"]} onChange={handleChange} className="input-field" step="any" />
            </div>
          </div>

        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button className="glowing-button" onClick={handlePredict} disabled={loading} style={{ fontSize: '1.1rem', padding: '15px 40px' }}>
            <ArrowRight size={20} />
            {loading ? 'Analyzing your trajectory...' : 'See My Prediction'}
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
                  {result.prediction === 'Graduate' ? 'ON TRACK' : result.prediction === 'Dropout' ? 'DROPZONE RISK' : 'ENROLLED'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>Based on current trajectory</p>
              </div>

              <div style={{ marginTop: '20px' }}>
                {result.prediction === 'Dropout' ? (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error-color)', padding: '15px', borderRadius: '0 8px 8px 0', fontSize: '0.95rem' }}>
                    <h4 style={{ color: 'var(--error-color)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <AlertTriangle size={18}/> High Risk Detected
                    </h4>
                    You are currently in the dropzone! Please focus heavily on improving your approved units and grades next semester. If you are struggling with tuition, speak to financial aid immediately.
                  </div>
                ) : result.prediction === 'Graduate' ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success-color)', padding: '15px', borderRadius: '0 8px 8px 0', fontSize: '0.95rem' }}>
                    <h4 style={{ color: 'var(--success-color)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Target size={18}/> Great Trajectory
                    </h4>
                    You are currently on track to graduate successfully! Keep up the excellent work and maintain your grades and unit approvals.
                  </div>
                ) : (
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-color)', padding: '15px', borderRadius: '0 8px 8px 0', fontSize: '0.95rem' }}>
                    <h4 style={{ color: 'var(--accent-color)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <BookOpen size={18}/> Steady Progress
                    </h4>
                    You are maintaining your enrollment status, but there is room for improvement to secure a graduation trajectory. Focus on passing all registered units.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Personal SHAP Impact */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
                What is affecting your score the most?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                The bars pushing to the right (green) are helping you succeed. The bars pushing to the left (red) are dragging you towards the dropzone.
              </p>
              
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={
                      result.shap.features.map((f, i) => ({ name: f, impact: result.shap.shap_values[i] }))
                        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                        .slice(0, 8)
                    }
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={180} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      formatter={(val) => val.toFixed(3)}
                    />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {
                        result.shap.features.map((f, i) => ({ name: f, impact: result.shap.shap_values[i] }))
                          .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                          .slice(0, 8).map((entry, index) => (
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
