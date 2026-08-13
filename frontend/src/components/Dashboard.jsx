import { useState, useEffect } from 'react';
import { UserCircle, LogOut, BookOpen, Activity, PieChart, Sun, Moon } from 'lucide-react';
import HowItWorks from './HowItWorks';
import PredictionPortal from './PredictionPortal';
import EDAReport from './EDAReport';
import StudentPortal from './StudentPortal';
import BatchUploadPortal from './BatchUploadPortal';

export default function Dashboard({ user, onLogout, isDemoMode }) {
  const [activeTab, setActiveTab] = useState(user.role === 'Student' ? 'student_portal' : 'guide');
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {isDemoMode && (
        <div style={{ background: 'var(--warning-color)', color: '#000', textAlign: 'center', padding: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ⚠️ DEMO MODE ACTIVE: Feel free to explore! Changes will not be permanently saved to the database.
        </div>
      )}
      <div style={{ display: 'flex', flexGrow: 1 }}>
      {/* Sidebar */}
      <div className="glass-panel" style={{ 
        width: '280px', 
        padding: '30px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '0 16px 16px 0', 
        borderLeft: 'none',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            style={{ 
              background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px',
              padding: '8px', cursor: 'pointer', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Toggle Light/Dark Mode"
          >
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserCircle size={30} color="white" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{user.name}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 'bold', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
              {user.role}
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
          
          {user.role === 'Student' ? (
            <button 
              onClick={() => setActiveTab('student_portal')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
                background: activeTab === 'student_portal' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: 'none', borderRadius: '8px', color: activeTab === 'student_portal' ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === 'student_portal' ? 'bold' : 'normal'
              }}
            >
              <Activity size={18} color={activeTab === 'student_portal' ? 'var(--accent-color)' : 'currentColor'} /> My Trajectory
            </button>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('guide')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
                  background: activeTab === 'guide' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: 'none', borderRadius: '8px', color: activeTab === 'guide' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === 'guide' ? 'bold' : 'normal'
                }}
              >
                <BookOpen size={18} color={activeTab === 'guide' ? 'var(--accent-color)' : 'currentColor'} /> Welcome & Guide
              </button>

              <button 
                onClick={() => setActiveTab('single')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
                  background: activeTab === 'single' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: 'none', borderRadius: '8px', color: activeTab === 'single' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === 'single' ? 'bold' : 'normal'
                }}
              >
                <Activity size={18} color={activeTab === 'single' ? 'var(--accent-color)' : 'currentColor'} /> Student Analysis
              </button>

              <button 
                onClick={() => setActiveTab('eda')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
                  background: activeTab === 'eda' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: 'none', borderRadius: '8px', color: activeTab === 'eda' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === 'eda' ? 'bold' : 'normal'
                }}
              >
                <PieChart size={18} color={activeTab === 'eda' ? 'var(--accent-color)' : 'currentColor'} /> Macro Insights (EDA)
              </button>
              {user.role === 'Admin' && (
                <button 
                  onClick={() => setActiveTab('batch')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
                    background: activeTab === 'batch' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    border: 'none', borderRadius: '8px', color: activeTab === 'batch' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === 'batch' ? 'bold' : 'normal'
                  }}
                >
                  <Activity size={18} color={activeTab === 'batch' ? 'var(--accent-color)' : 'currentColor'} /> Batch Analysis
                </button>
              )}
            </>
          )}
        </nav>

        <button 
          onClick={onLogout}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
            background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)',
            border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
          }}
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="glowing-text" style={{ fontSize: '2.5rem', margin: '0 0 30px 0' }}>🎓 AI Student Retention Engine</h1>
        
        {activeTab === 'guide' && <HowItWorks />}
        {activeTab === 'single' && <PredictionPortal />}
        {activeTab === 'eda' && <EDAReport />}
        {activeTab === 'batch' && <BatchUploadPortal />}
        {activeTab === 'student_portal' && <StudentPortal />}
      </div>
    </div>
    </div>
  );
}
