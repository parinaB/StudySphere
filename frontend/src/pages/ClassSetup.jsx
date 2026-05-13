import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const SLOTS = [
  { time: '9:00–9:45', disabled: false },
  { time: '10:00–10:45', disabled: false },
  { time: '11:00–11:15', disabled: true, label: 'Break' },
  { time: '11:15–12:00', disabled: false },
  { time: '1:00–2:00', disabled: true, label: 'Break' },
  { time: '2:00–2:45', disabled: false },
  { time: '3:00–3:45', disabled: false },
  { time: '4:00–4:45', disabled: false },
];

export default function ClassSetup() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject && topic && selectedSlot) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

      {/* Header section similar to login */}
      <div className="flex items-center gap-4 mb-6 card-navy" style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-bg-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>StudySphere</h2>
          <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '0.25rem' }}>Configure your upcoming session</p>
        </div>
      </div>

      <div className="card">
        <h1 className="card-title card-title-center" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Class Setup</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="form-group mb-0">
              <label className="form-label">Subject Name</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-input"
                placeholder="e.g. Mathematics"
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Subtopic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-input"
                placeholder="e.g. Calculus"
                required
              />
            </div>
          </div>

          <div className="form-group mb-8">
            <label className="form-label mb-4">Select Time Slot</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SLOTS.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={slot.disabled}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`time-slot ${selectedSlot === slot.time ? 'selected' : ''}`}
                  style={{ padding: '1.25rem 1rem' }}
                >
                  <p>{slot.time}</p>
                  {slot.label && <p className="text-xs mt-1" style={{ opacity: 0.8 }}>{slot.label}</p>}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={!subject || !topic || !selectedSlot}
              className="btn btn-primary"
              style={{ padding: '1.25rem' }}
            >
              Start Session Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
