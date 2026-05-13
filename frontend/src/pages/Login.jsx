import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const TEACHERS = [
  { name: 'Shweta Mam', id: 'T001', subject: 'DBMS' },
  { name: "Riya Ma'am", id: 'T002', subject: 'Operating Systems' },
  { name: "Kavita Ma'am", id: 'T003', subject: 'Computer Networks' },
];

export default function Login() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (name && id) {
      navigate('/setup');
    }
  };

  const autoFill = (teacher) => {
    setName(teacher.name);
    setId(teacher.id);
  };

  return (
    <div className="page-wrapper-large animate-fade-in flex flex-col" style={{minHeight: '80vh'}}>
      
      {/* Section 2: Content Split */}
      <div className="grid lg:grid-cols-2 gap-8 flex-1 w-full" style={{marginTop: '4rem'}}>
        
        {/* Left: Login Form */}
        <div className="card h-full flex flex-col justify-center" style={{marginBottom: 0}}>
          <h1 className="card-title" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Welcome Back!</h1>
          <p className="text-gray mb-8">Please enter your credentials to access your classroom analytics.</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group mb-6">
              <label className="form-label">Teacher Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="e.g. Shweta Mam"
                required
              />
            </div>
            <div className="form-group mb-8">
              <label className="form-label">Teacher ID</label>
              <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="form-input"
                placeholder="e.g. T001"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{padding: '1.25rem', fontSize: '1.125rem'}}>
              Login to Dashboard
            </button>
          </form>
        </div>

        {/* Right: Saved Logins */}
        <div className="card h-full flex flex-col justify-center" style={{marginBottom: 0, backgroundColor: 'var(--color-bg-soft)', border: 'none'}}>
          <h3 className="card-title text-center" style={{fontSize: '1.25rem', marginBottom: '2rem'}}>Recent Logins</h3>
          <div className="flex flex-col gap-4">
            {TEACHERS.map((teacher, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => autoFill(teacher)}
                className="teacher-card"
                style={{backgroundColor: 'var(--color-bg-card)', padding: '1.25rem', borderRadius: '16px'}}
              >
                <div className="avatar" style={{width: '56px', height: '56px', fontSize: '1.5rem'}}>👩‍🏫</div>
                <div>
                  <p className="font-bold text-dark" style={{fontSize:'1.125rem', marginBottom: '0.25rem'}}>{teacher.name}</p>
                  <p className="font-medium text-accent" style={{fontSize: '0.875rem'}}>{teacher.subject}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
