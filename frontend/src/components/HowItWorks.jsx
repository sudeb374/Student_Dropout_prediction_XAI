import React, { useState } from 'react';
import { BookOpen, UserCheck, Activity, BarChart2, MousePointerClick, BrainCircuit, PlayCircle, Layers, GraduationCap, MapPin, Calculator } from 'lucide-react';

export default function HowItWorks() {
  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (index) => {
    if (activeCard === index) setActiveCard(null);
    else setActiveCard(index);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-color)', padding: '20px', borderRadius: '0 8px 8px 0', marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={28} color="var(--accent-color)" />
          Welcome Guide: How to Use the Portal
        </h2>
        <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          This portal uses an advanced Machine Learning Engine to predict student dropout risk. 
          Follow the visual guide below to understand how data flows through the system and how to enter it correctly.
        </p>
      </div>

      {/* Step-by-Step Walkthrough */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3 className="glowing-text" style={{ margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MousePointerClick size={24} />
          Quick Start Walkthrough
        </h3>
        
        <div className="stepper-step">
          <div className="stepper-icon">1</div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Select Your Portal</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Choose whether you are an <strong>Administrator</strong> analyzing a specific profile, or a <strong>Student</strong> looking to check your own trajectory from the navigation menu above.
            </p>
          </div>
        </div>

        <div className="stepper-step">
          <div className="stepper-icon">2</div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Fill in the Metrics</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Use our custom-designed dropdowns to input demographic, financial, and academic data. The options are tailored for the Indian education system (e.g., SGPA, Credit Transfers).
            </p>
          </div>
        </div>

        <div className="stepper-step" style={{ marginBottom: 0 }}>
          <div className="stepper-icon">3</div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Predict & Act</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Click the "Predict" button. Our AI will instantly calculate the dropout risk and prescribe personalized interventions to improve student success!
            </p>
          </div>
        </div>
      </div>

      {/* Flowchart Diagram */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px', textAlign: 'center' }}>
        <h3 className="glowing-text" style={{ margin: '0 0 30px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Activity size={24} />
          How the AI Model Works
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="info-card" style={{ width: '150px', padding: '15px 10px', textAlign: 'center', cursor: 'default' }}>
              <UserCheck size={28} color="var(--accent-color)" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Demographics</div>
            </div>
            <div className="info-card" style={{ width: '150px', padding: '15px 10px', textAlign: 'center', cursor: 'default' }}>
              <GraduationCap size={28} color="var(--success-color)" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Academics</div>
            </div>
            <div className="info-card" style={{ width: '150px', padding: '15px 10px', textAlign: 'center', cursor: 'default' }}>
              <BarChart2 size={28} color="var(--warning-color)" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Economics</div>
            </div>
          </div>

          {/* SVG Animated Arrows */}
          <svg width="200" height="60" viewBox="0 0 200 60">
            <path d="M 30,0 L 100,50" className="flowing-line" fill="none" />
            <path d="M 100,0 L 100,50" className="flowing-line" fill="none" />
            <path d="M 170,0 L 100,50" className="flowing-line" fill="none" />
            <circle cx="100" cy="55" r="5" fill="var(--accent-color)" />
          </svg>

          <div className="pulse-node" style={{ background: 'rgba(37, 99, 235, 0.2)', border: '2px solid var(--accent-color)', padding: '20px 40px', display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
            <BrainCircuit size={32} color="var(--accent-color)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Ensemble ML Engine</div>
            </div>
          </div>

          <svg width="100" height="60" viewBox="0 0 100 60">
            <path d="M 50,0 L 50,55" className="flowing-line" fill="none" />
            <polygon points="45,50 55,50 50,60" fill="var(--accent-color)" />
          </svg>

          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
            <div style={{ padding: '15px', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid var(--success-color)', borderRadius: '8px', color: 'var(--success-color)', fontWeight: 'bold', width: '140px' }}>
              Low Risk (Graduate)
            </div>
            <div style={{ padding: '15px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--error-color)', borderRadius: '8px', color: '#f87171', fontWeight: 'bold', width: '140px' }}>
              High Risk (Dropout)
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Data Dictionary Cards */}
      <div>
        <h3 className="glowing-text" style={{ margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={24} />
          Interactive Data Dictionary
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>
          Click on any category below to understand exactly what information you need to provide.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Card 1 */}
          <div className="info-card" onClick={() => toggleCard(1)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: activeCard === 1 ? '15px' : '0' }}>
              <MapPin size={28} color="var(--accent-color)" />
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Demographics</h4>
            </div>
            {activeCard === 1 && (
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>Marital Status:</strong> Single, Married, etc.</li>
                <li><strong>Nationality:</strong> Indian vs Foreign</li>
                <li><strong>Displaced:</strong> Outstation or Migrated students</li>
                <li><strong>Parents' Background:</strong> Education and Occupation</li>
              </ul>
            )}
          </div>

          {/* Card 2 */}
          <div className="info-card" onClick={() => toggleCard(2)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: activeCard === 2 ? '15px' : '0' }}>
              <GraduationCap size={28} color="#a855f7" />
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Academic Performance</h4>
            </div>
            {activeCard === 2 && (
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>Subjects Registered:</strong> Total courses enrolled in.</li>
                <li><strong>Assessments Attempted:</strong> Exams appeared for.</li>
                <li><strong>Subjects Passed:</strong> Subjects cleared successfully.</li>
                <li><strong>Average Marks/SGPA:</strong> Overall GPA out of 20 scale.</li>
                <li><strong>Credit Transfer Subjects:</strong> External credits.</li>
              </ul>
            )}
          </div>

          {/* Card 3 */}
          <div className="info-card" onClick={() => toggleCard(3)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: activeCard === 3 ? '15px' : '0' }}>
              <Calculator size={28} color="#10b981" />
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Financials & Enrollment</h4>
            </div>
            {activeCard === 3 && (
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>Tuition Fees Up to Date:</strong> Yes/No</li>
                <li><strong>Scholarship Holder:</strong> Yes/No</li>
                <li><strong>Debtor Status:</strong> Outstanding college dues.</li>
                <li><strong>Application Mode:</strong> JoSAA, Direct Admission, etc.</li>
              </ul>
            )}
          </div>

        </div>
      </div>

      {/* Sample Result Guide */}
      <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
        <h3 className="glowing-text" style={{ margin: '0 0 25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={24} />
          Academic Result Guide
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>
          Use this sample result sheet to identify key values needed for the prediction portal. 
          The red circles indicate where you can typically find these metrics on your own A4 result transcript.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
          
          {/* Explanation List */}
          <div style={{ flex: '1 1 300px', background: 'var(--panel-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '2' }}>
              <li><strong style={{ color: 'var(--accent-color)' }}>Credit Scoring Subject:</strong> The <em>Credit</em> column indicates the weightage of the subject. These are the subjects that contribute to your final SGPA.</li>
              <li><strong style={{ color: 'var(--accent-color)' }}>Registered Subject:</strong> The total number of subjects you appeared for (count the subjects in your result sheet).</li>
              <li><strong style={{ color: 'var(--accent-color)' }}>Assessment:</strong> Your internal evaluation totals, which usually include assignments, PPTs, and mid-sems. (often reflected in your final letter grade).</li>
              <li><strong style={{ color: 'var(--accent-color)' }}>SGPA / Grade:</strong> Your Semester Grade Point Average (Total Credit Points ÷ Total Credits). Needed for the <em>Average Marks/SGPA</em> input.</li>
            </ul>
          </div>
          
          {/* Mock Result Sheet with Circles */}
          <div style={{ 
            flex: '1 1 450px', background: 'white', color: 'black', padding: '30px', 
            borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative',
            fontFamily: 'serif', overflowX: 'auto', minHeight: '320px'
          }}>
            <h4 style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px', textTransform: 'uppercase' }}>Semester Grade Report</h4>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'center', minWidth: '400px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '6px', position: 'relative' }}>
                    Course Code
                    <div style={{ position: 'absolute', top: '100%', left: '-2px', width: 'calc(100% + 4px)', height: '115px', border: '2px solid red', borderRadius: '4px', zIndex: 10 }}></div>
                    <div style={{ position: 'absolute', top: '70%', left: '-25px', color: 'red', fontWeight: 'bold', fontSize: '0.75rem', background: 'white', padding: '2px 5px', border: '1px solid red', zIndex: 11 }}>Registered</div>
                  </th>
                  <th style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Course Name</th>
                  <th style={{ border: '1px solid black', padding: '6px' }}>Letter Grade</th>
                  <th style={{ border: '1px solid black', padding: '6px' }}>Grade Points</th>
                  <th style={{ border: '1px solid black', padding: '6px', position: 'relative' }}>
                    Credit
                    <div style={{ position: 'absolute', top: '100%', left: '-2px', width: 'calc(100% + 4px)', height: '115px', border: '2px solid red', borderRadius: '4px', zIndex: 10 }}></div>
                    <div style={{ position: 'absolute', top: '-18px', right: '-10px', color: 'red', fontWeight: 'bold', fontSize: '0.75rem', background: 'white', padding: '2px 5px', border: '1px solid red', zIndex: 11 }}>Credits</div>
                  </th>
                  <th style={{ border: '1px solid black', padding: '6px' }}>Credit Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid black', padding: '6px' }}>BBS00014</td>
                  <td style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Probability and Statistics</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>O</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>10</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>3</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>30</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '6px' }}>BHS00005</td>
                  <td style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Design Thinking for Startups</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>O</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>10</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>3</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>30</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '6px' }}>BTA40105</td>
                  <td style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Operating Systems</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>O</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>10</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>3</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>30</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '6px' }}>BTA40107</td>
                  <td style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Object Oriented Programming</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>A+</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>9</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>3</td>
                  <td style={{ border: '1px solid black', padding: '6px' }}>27</td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
              <span>Total Credits: 12</span>
              <span>Total Credit Points: 117</span>
              <span style={{ marginRight: '15px', position: 'relative' }}>
                SGPA: 9.75
                <div style={{ position: 'absolute', top: '-5px', left: '-10px', right: '-10px', bottom: '-5px', border: '2px solid red', borderRadius: '14px', zIndex: 10 }}></div>
                <div style={{ position: 'absolute', bottom: '-22px', right: '-10px', color: 'red', fontWeight: 'bold', fontSize: '0.75rem', background: 'white', padding: '2px 5px', border: '1px solid red', zIndex: 11, whiteSpace: 'nowrap' }}>Your SGPA</div>
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
