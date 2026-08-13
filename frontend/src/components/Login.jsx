import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

export default function Login({ onLogin, isDemoMode, setIsDemoMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!isDemoMode) {
      setError('Production mode is locked/unavailable. Please use Demo Mode to explore the application.');
      return;
    }

    if (username === 'admin_demo' && password === 'admin123') {
      onLogin({ role: 'Admin', name: 'Dean of Engineering' });
    } else if (username === 'counselor_demo' && password === 'counselor123') {
      onLogin({ role: 'Counselor', name: 'Academic Counselor' });
    } else if (username === 'student_demo' && password === 'student123') {
      onLogin({ role: 'Student', name: 'Current Student' });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleModeToggle = (mode) => {
    setIsDemoMode(mode === 'demo');
    setError('');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '20px',
      backgroundImage: 'linear-gradient(rgba(3, 3, 5, 0.6), rgba(15, 15, 25, 0.8)), url("/images.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'absolute', /* Ensure it covers everything if App.jsx has padding */
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 10
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
        <h1 className="glowing-text" style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>🎓 University Analytics Portal</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: 0 }}>AI-Powered Student Retention Engine</p>
      </div>

      <div className="glass-panel animate-fade-in delay-1" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
        
        {/* Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => handleModeToggle('demo')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '6px',
              background: isDemoMode ? 'var(--accent-color)' : 'transparent',
              color: isDemoMode ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s'
            }}
          >
            Demo Mode
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle('prod')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '6px',
              background: !isDemoMode ? 'var(--accent-color)' : 'transparent',
              color: !isDemoMode ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
            }}
          >
            <Shield size={16} /> Production
          </button>
        </div>

        <h2 style={{ margin: '0 0 30px 0', textAlign: 'center' }}>Secure Login</h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error-color)', padding: '10px 15px', borderRadius: '4px', marginBottom: '20px', color: 'var(--error-color)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '40px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          <div>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="glowing-button" style={{ marginTop: '10px' }}>
            Authenticate
          </button>
        </form>

        {isDemoMode && (
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>Test Accounts (Demo Only):</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                <span>Admin:</span> <strong>admin_demo / admin123</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                <span>Counselor:</span> <strong>counselor_demo / counselor123</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Student:</span> <strong>student_demo / student123</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
