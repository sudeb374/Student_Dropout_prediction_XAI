import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const handleLogin = (userData) => {
    sessionStorage.clear(); // Ensure fresh state if user navigated away without logging out
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear saved input values and any other session data
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} isDemoMode={isDemoMode} />
      ) : (
        <Login onLogin={handleLogin} isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode} />
      )}
    </>
  )
}

export default App
