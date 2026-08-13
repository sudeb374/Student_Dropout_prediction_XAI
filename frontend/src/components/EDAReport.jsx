import { useState, useEffect } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis, Cell } from 'recharts';
import { PieChart, Loader } from 'lucide-react';

export default function EDAReport() {
  const [momentumData, setMomentumData] = useState([]);
  const [ageCourseData, setAgeCourseData] = useState([]);
  const [motherQualData, setMotherQualData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMom, resAge, resMomQ] = await Promise.all([
          fetch('https://student-dropout-prediction-with-xai.onrender.com/api/eda/momentum'),
          fetch('https://student-dropout-prediction-with-xai.onrender.com/api/eda/age_course'),
          fetch('https://student-dropout-prediction-with-xai.onrender.com/api/eda/mother_qual')
        ]);
        
        setMomentumData(await resMom.json());
        setAgeCourseData(await resAge.json());
        setMotherQualData(await resMomQ.json());
      } catch (err) {
        console.error("Failed to fetch EDA data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTargetColor = (target) => {
    if (target === 'Graduate') return 'var(--success-color)';
    if (target === 'Dropout') return 'var(--error-color)';
    return 'var(--accent-color)'; // Enrolled
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Loader className="glowing-text" size={40} style={{ animation: 'spin 2s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '30px' }}>
        <h2 className="glowing-text" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PieChart size={24} /> Comprehensive Feature Analysis & Insights
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Explore relational diagrams to understand key drivers of student retention.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Chart 1: Academic Momentum */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Academic Momentum: 1st vs 2nd Sem Approved Units</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Early failure strongly correlates with dropping out (red).</p>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" dataKey="sem1" name="Sem 1 Approved" stroke="var(--text-secondary)" />
                <YAxis type="number" dataKey="sem2" name="Sem 2 Approved" stroke="var(--text-secondary)" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.2)' }} />
                <Scatter name="Students" data={momentumData.slice(0, 500)} fill="#8884d8">
                  {momentumData.slice(0, 500).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTargetColor(entry.target)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Mother's Qualification */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Dropout Probability by Mother's Qualification</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Lower qualification often correlates with higher dropout.</p>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={motherQualData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="qualification" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" tickFormatter={(tick) => `${(tick*100).toFixed(0)}%`} />
                <Tooltip formatter={(val) => `${(val*100).toFixed(1)}%`} contentStyle={{ background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.2)' }} />
                <Bar dataKey="dropout_rate" fill="var(--warning-color)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <h3 className="glowing-text" style={{ marginTop: '40px' }}>Advanced Model Analytics (SHAP & Confusion Matrices)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>SHAP Summary Plot</h4>
          <img src="https://student-dropout-prediction-with-xai.onrender.com/static/summary_plot_Beeswarm1.png" alt="SHAP Beeswarm" style={{ width: '100%', borderRadius: '8px', filter: 'invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.2)' }} />
        </div>

        <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Joint Effect (Age & Course)</h4>
          <img src="https://student-dropout-prediction-with-xai.onrender.com/static/Joint%20Effect%20of%20Age%26Course%20on%20Dropout%20Risk1.png" alt="Age and Course" style={{ width: '100%', borderRadius: '8px', filter: 'invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.2)' }} />
        </div>

        <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>XGBoost Confusion Matrix</h4>
          <img src="https://student-dropout-prediction-with-xai.onrender.com/static/confusion-matrix-XGB.png" alt="Confusion Matrix" style={{ width: '100%', borderRadius: '8px', filter: 'invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.2)' }} />
        </div>

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
