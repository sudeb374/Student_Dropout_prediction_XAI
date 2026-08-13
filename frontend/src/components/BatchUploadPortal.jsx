import { useState } from 'react';
import { UploadCloud, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';

export default function BatchUploadPortal() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/predict_batch', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Failed to connect to backend. Is the server running?');
      }
      
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 className="glowing-text" style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UploadCloud size={24} />
          Batch Student Analysis
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Upload a CSV file containing multiple student records to evaluate their dropout risks all at once. The system will identify high-risk students so you can prioritize interventions.
        </p>

        <div style={{ 
          border: '2px dashed rgba(255, 255, 255, 0.2)', 
          padding: '40px', 
          borderRadius: '12px', 
          textAlign: 'center',
          background: 'rgba(0,0,0,0.2)',
          marginBottom: '20px'
        }}>
          <div style={{ textAlign: 'right', marginBottom: '-20px' }}>
            <a href="/studentdropout_200_synthetic_no_target.csv" download className="glowing-text" style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
              <Download size={14} /> Download Demo CSV
            </a>
          </div>
          <FileText size={48} color="var(--accent-color)" style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0' }}>{file ? file.name : "Select a CSV File"}</h3>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            id="csvUpload"
          />
          <label htmlFor="csvUpload" className="glowing-button" style={{ display: 'inline-block', cursor: 'pointer', marginTop: '10px' }}>
            Browse Files
          </label>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            className="glowing-button" 
            onClick={handleUpload} 
            disabled={loading || !file} 
            style={{ fontSize: '1.1rem', padding: '15px 40px', background: loading || !file ? 'rgba(255,255,255,0.1)' : 'var(--accent-color)' }}
          >
            {loading ? 'Processing Batch...' : 'Run Analysis'}
          </button>
        </div>
        
        {error && <div style={{ color: 'var(--error-color)', marginTop: '20px', textAlign: 'center' }}>🚨 {error}</div>}
      </div>

      {results && (
        <div className="glass-panel animate-fade-in delay-2" style={{ padding: '30px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, marginBottom: '20px' }}>
            <AlertTriangle size={20} color="var(--warning-color)" /> Risk Assessment Results
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ padding: '12px', color: 'var(--accent-color)' }}>Student Identifier</th>
                  <th style={{ padding: '12px', color: 'var(--accent-color)' }}>Prediction</th>
                  <th style={{ padding: '12px', color: 'var(--accent-color)' }}>Dropout Probability</th>
                  <th style={{ padding: '12px', color: 'var(--accent-color)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.sort((a, b) => b.confidence_scores.Dropout - a.confidence_scores.Dropout).map((res, idx) => {
                  const isHighRisk = res.prediction === 'Dropout';
                  return (
                    <tr key={idx} style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: isHighRisk ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                    }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{res.identifier !== undefined ? res.identifier : `Row ${idx + 1}`}</td>
                      <td style={{ padding: '12px', color: isHighRisk ? 'var(--error-color)' : res.prediction === 'Graduate' ? 'var(--success-color)' : 'var(--text-primary)' }}>
                        {res.prediction}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {(res.confidence_scores.Dropout * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '12px' }}>
                        {isHighRisk ? (
                          <span style={{ background: 'var(--error-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>High Risk</span>
                        ) : res.prediction === 'Graduate' ? (
                          <span style={{ background: 'var(--success-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>On Track</span>
                        ) : (
                          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Enrolled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
