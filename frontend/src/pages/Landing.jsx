import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full animate-fade-in text-center" style={{ minHeight: '80vh' }}>

      <div style={{ maxWidth: '500px', width: '100%', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--color-bg-card)', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)' }}>
        <img
          src="/logo.png"
          alt="StudySphere Logo"
          style={{ width: '200px', height: '200px', borderRadius: '16px', marginBottom: '1.5rem', border: '2px solid rgba(255,255,255,0.2)' }}
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none', width: '80px', height: '80px', borderRadius: '16px', backgroundColor: 'var(--color-bg-soft)', color: 'var(--color-primary)', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <BookOpen size={40} />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--color-primary)' }}>StudySphere</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-gray)', marginBottom: '2.5rem', fontStyle: 'italic', lineHeight: 1.5 }}>
          "Empowering educators with real-time AI comprehension analytics."
        </p>

        <button
          onClick={() => navigate('/login')}
          className="btn btn-accent"
          style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '99px' }}
        >
          Get Started
        </button>
      </div>

    </div>
  );
}
