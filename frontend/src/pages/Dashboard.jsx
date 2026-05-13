import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Video, StopCircle, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:5050';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Video Session State
  const [sessionRunning, setSessionRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [latestScore, setLatestScore] = useState({ score: 0, label: 'No data' });
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  // Image Eval State
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startVideoSession = async () => {
    try {
      await axios.post(`${API_BASE}/start-video`);
      setSessionRunning(true);
      setElapsedTime(0);
      
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      pollRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/comprehension`);
          if (res.data) setLatestScore(res.data);
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
      
    } catch (e) {
      console.error("Failed to start video session", e);
      alert("Failed to start session. Ensure backend is running.");
    }
  };

  const stopVideoSession = async () => {
    try {
      await axios.post(`${API_BASE}/stop-video`);
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
      setSessionRunning(false);
      navigate('/report');
    } catch (e) {
      console.error("Failed to stop video session", e);
      alert("Failed to stop session.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedImage(URL.createObjectURL(file));
    setIsEvaluating(true);
    setEvalResult(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.post(`${API_BASE}/evaluate`, formData);
      if (res.data.error) {
        alert(res.data.error);
      } else {
        setEvalResult(res.data);
      }
    } catch (err) {
      console.error("Eval error", err);
      alert("Evaluation failed.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const ProgressBar = ({ label, value, colorClass }) => (
    <div style={{marginBottom: '1rem'}}>
      <div className="flex justify-between font-medium text-gray mb-2" style={{fontSize: '0.875rem'}}>
        <span>{label}</span>
        <span className="font-bold text-dark">{value}%</span>
      </div>
      <div className="progress-container">
        <div className={`progress-bar ${colorClass}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper-large animate-fade-in pb-8">
      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="card-title mb-0" style={{fontSize: '2.5rem', color: 'var(--color-primary)'}}>Dashboard</h1>
      </div>

      <div className={sessionRunning || selectedImage ? "flex flex-col gap-8 w-full" : "dashboard-layout"}>
        
        {/* Card 1: Video Session (Navy Style) */}
        {!selectedImage && (
        <div className="card-navy flex flex-col" style={{marginBottom: 0, width: sessionRunning ? '100%' : 'auto', maxWidth: sessionRunning ? '1200px' : 'none', margin: sessionRunning ? '0 auto' : '0'}}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="card-title mb-0 flex items-center gap-3" style={{fontSize: '1.5rem'}}>
              <Video color="var(--color-accent)" size={24} /> Live Monitoring
            </h2>
            {sessionRunning && (
              <div className="status-badge">
                <div className="dot-ping-wrapper">
                  <span className="dot-ping"></span>
                  <span className="dot-solid"></span>
                </div>
                Running ({formatTime(elapsedTime)})
              </div>
            )}
          </div>

          {!sessionRunning ? (
            <div className="flex-1 flex flex-col items-center justify-center" style={{padding: '4rem 0', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)'}}>
              <div className="icon-wrapper" style={{color: 'var(--color-accent)', backgroundColor: 'var(--color-bg-card)', width: '80px', height: '80px', marginBottom: '1.5rem'}}>
                <Video size={40} />
              </div>
              <h3 className="font-bold mb-2 text-light" style={{fontSize: '1.5rem'}}>Ready to Start</h3>
              <p className="text-small mb-8 text-center" style={{maxWidth: '300px', opacity: 0.8}}>
                Begin real-time tracking of student comprehension using your webcam.
              </p>
              <button 
                onClick={startVideoSession}
                className="btn btn-accent"
                style={{width: 'auto', padding: '1rem 3rem', borderRadius: '99px'}}
              >
                Start Session
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-6 w-full">
              <div className="video-container" style={{borderColor: 'var(--color-accent)', width: '100%', margin: '0 auto'}}>
                <img src={`${API_BASE}/stream`} alt="Live stream" />
                <div className="live-score-overlay">
                  <p className="font-bold text-xs" style={{textTransform:'uppercase', letterSpacing:'1px', marginBottom: '4px', opacity: 0.8}}>Live Score</p>
                  <div className="font-bold text-light" style={{fontSize: '1.75rem'}}>{latestScore.score}%</div>
                  <p className="font-medium text-xs mt-1" style={{
                    color: latestScore.label === 'Understood' ? '#68D391' : 
                           latestScore.label === 'Uncertain' ? '#F6E05E' : '#FC8181'
                  }}>
                    {latestScore.label}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={stopVideoSession}
                className="btn"
                style={{marginTop: 'auto', backgroundColor: 'var(--color-danger)', color: 'white'}}
              >
                <div className="flex items-center gap-2 justify-center">
                  <StopCircle size={20} /> End Session
                </div>
              </button>
            </div>
          )}
        </div>
        )}

        {/* Card 2: Image Eval (White Style) */}
        {!sessionRunning && (
        <div className="card flex flex-col" style={{marginBottom: 0, width: selectedImage ? '100%' : 'auto', maxWidth: selectedImage ? '800px' : 'none', margin: selectedImage ? '0 auto' : '0'}}>
          <h2 className="card-title flex items-center gap-3 mb-8" style={{fontSize: '1.5rem'}}>
            <UploadCloud color="var(--color-accent)" size={24} /> Snapshot Evaluation
          </h2>

          <label className={`dropzone ${selectedImage ? 'has-image' : ''}`}>
            <input type="file" style={{display: 'none'}} accept="image/*" onChange={handleImageUpload} disabled={isEvaluating} />
            
            {selectedImage ? (
              <div style={{position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--color-bg)'}}>
                <img src={selectedImage} alt="Selected" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center" style={{padding: '3rem 0'}}>
                <div className="icon-wrapper" style={{width: '64px', height: '64px', marginBottom: '1.5rem'}}>
                  <UploadCloud size={32} />
                </div>
                <p className="font-bold text-dark text-center" style={{fontSize: '1.125rem', marginBottom: '0.5rem'}}>Click to upload or drag & drop</p>
                <p className="text-small text-gray text-center">Classroom image for instant analysis</p>
              </div>
            )}
          </label>

          {isEvaluating && (
            <div className="flex flex-col items-center justify-center mt-8 mb-4 flex-1">
              <Loader2 className="animate-spin mb-4" size={40} color="var(--color-accent)" />
              <p className="font-medium text-primary text-small animate-pulse">Analyzing student expressions...</p>
            </div>
          )}

          {evalResult && !isEvaluating && (
            <div className="mt-8 animate-fade-in flex-1 flex flex-col justify-end">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-dark" style={{fontSize: '1.25rem'}}>Results</h3>
                <div className="text-right bg-bg-soft" style={{backgroundColor: 'var(--color-bg-soft)', padding: '0.5rem 1rem', borderRadius: '12px'}}>
                  <span className="text-xs font-semibold text-primary" style={{display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Overall Score</span>
                  <span className="font-bold text-primary" style={{fontSize: '1.5rem'}}>{evalResult.final_score}%</span>
                </div>
              </div>
              
              <div style={{backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)'}}>
                <ProgressBar label="Understood" value={evalResult.understood_pct} colorClass="bg-cyan" />
                <ProgressBar label="Uncertain" value={evalResult.uncertain_pct} colorClass="bg-yellow" />
                <ProgressBar label="Not Understood" value={evalResult.not_understood_pct} colorClass="bg-coral" />
                
                <div style={{marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '2px solid var(--color-border)'}}>
                  <p className="text-xs text-gray font-semibold mb-1" style={{textTransform: 'uppercase', letterSpacing: '0.05em'}}>Verdict</p>
                  <p className="font-bold text-dark" style={{fontSize: '1.125rem'}}>{evalResult.verdict}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        )}

      </div>
    </div>
  );
}
