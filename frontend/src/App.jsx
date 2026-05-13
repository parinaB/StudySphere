import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ClassSetup from './pages/ClassSetup';
import Dashboard from './pages/Dashboard';
import SessionReport from './pages/SessionReport';

function ThemeToggler() {
  const [theme, setTheme] = useState('lavender');

  useEffect(() => {
    document.body.classList.remove('theme-yellow', 'theme-blue');
    if (theme !== 'lavender') {
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const themes = [
    { id: 'lavender', color: '#9333EA', name: 'Lilac' },
    { id: 'yellow', color: '#D97706', name: 'Yellow' },
    { id: 'blue', color: '#3B82F6', name: 'Blue' }
  ];

  return (
    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 1000, display: 'flex', gap: '0.5rem', backgroundColor: 'var(--color-bg-card)', padding: '0.5rem', borderRadius: '99px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)' }}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.name}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: t.color,
            border: theme === t.id ? '2px solid var(--color-text-dark)' : '2px solid transparent',
            cursor: 'pointer',
            padding: 0,
            transition: 'transform 0.2s ease',
            transform: theme === t.id ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      ))}
    </div>
  );
}

function GlobalLogo() {
  return (
    <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <img 
        src="/logo.png" 
        alt="StudySphere" 
        style={{ width: '40px', height: '40px', borderRadius: '8px' }}
        onError={(e) => { 
          e.target.style.display='none'; 
        }} 
      />
      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>StudySphere</span>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container" style={{ position: 'relative' }}>
        <GlobalLogo />
        <ThemeToggler />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<ClassSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<SessionReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
