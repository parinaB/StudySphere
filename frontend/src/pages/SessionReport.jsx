import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';
import { Home, Loader2, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5050';

export default function SessionReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${API_BASE}/session-report`);
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setData(res.data);
        }
      } catch (err) {
        setError("Failed to fetch session report");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full" style={{minHeight: '60vh'}}>
        <Loader2 className="animate-spin mb-6" size={48} color="var(--color-primary)" />
        <h2 className="font-bold text-primary" style={{fontSize: '1.5rem'}}>Generating Report...</h2>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center" style={{minHeight: '60vh'}}>
        <div className="icon-wrapper" style={{color: 'var(--color-danger)', backgroundColor: 'rgba(229, 62, 62, 0.1)', width: '80px', height: '80px', marginBottom: '2rem'}}>
          <AlertCircle size={40} />
        </div>
        <h2 className="card-title mb-4" style={{fontSize: '2rem', color: 'var(--color-primary)'}}>No Data Available</h2>
        <p className="text-gray mb-8 text-center" style={{fontSize: '1.125rem'}}>{error || "Session ended before any data was collected."}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
          style={{padding: '1rem 2.5rem', width: 'auto', borderRadius: '99px'}}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getVerdictIcon = () => {
    if (data.final_score >= 75) return <CheckCircle size={40} />;
    if (data.final_score >= 50) return <AlertTriangle size={40} />;
    return <AlertCircle size={40} />;
  };

  const getVerdictClass = () => {
    if (data.final_score >= 75) return 'verdict-success';
    if (data.final_score >= 50) return 'verdict-warning';
    return 'verdict-danger';
  };

  const peakPoint = data && data.timeline && data.timeline.length > 0 
    ? data.timeline.reduce((prev, current) => (prev.score > current.score) ? prev : current, data.timeline[0])
    : null;

  // Graph gets all data (every 5 seconds). Table gets data every 30 seconds (every 6th item).
  const tableData = data && data.timeline ? data.timeline.filter((_, idx) => (idx + 1) % 6 === 0) : [];

  return (
    <div className="page-wrapper-large animate-fade-in" style={{paddingBottom: '4rem'}}>
      <div className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="card-title mb-2" style={{fontSize: '2.5rem', color: 'var(--color-primary)'}}>Session Report</h1>
          <p className="text-gray" style={{fontSize: '1.125rem'}}>Detailed breakdown of student comprehension</p>
        </div>
        <button 
          onClick={() => navigate('/setup')}
          className="btn btn-outline flex items-center gap-2"
          style={{padding: '0.75rem 1.5rem', borderRadius: '99px'}}
        >
          <Home size={18} /> New Class
        </button>
      </div>

      <div className={`verdict-card ${getVerdictClass()} mb-8`}>
        <div className="verdict-icon">
          {getVerdictIcon()}
        </div>
        <div>
          <p className="font-bold" style={{opacity: 0.8, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'}}>Final Verdict</p>
          <p className="font-bold" style={{fontSize: '2rem', lineHeight: 1.2}}>{data.verdict}</p>
        </div>
        
        <div className="verdict-score" style={{marginLeft: 'auto'}}>
          <p className="font-bold" style={{opacity: 0.8, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'}}>Overall Score</p>
          <p className="font-bold" style={{fontSize: '3rem', lineHeight: 1}}>{data.final_score}%</p>
        </div>
      </div>

      <div className="dashboard-layout">
        
        {/* Graph */}
        <div className="card-navy" style={{marginBottom: 0, padding: '2.5rem'}}>
          <h3 className="card-title" style={{fontSize: '1.25rem', marginBottom: '2rem', textAlign: 'center'}}>Concentration Trend</h3>
          <div style={{height: '300px', width: '100%', display: 'flex', justifyContent: 'center'}}>
            <ResponsiveContainer width="95%" height="100%">
              <LineChart data={data.timeline} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                  dy={15}
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-dark)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                  itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--color-accent)" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: 'var(--color-accent)', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, fill: 'var(--color-bg-card)', stroke: 'var(--color-accent)', strokeWidth: 3 }}
                />
                {peakPoint && (
                  <ReferenceDot 
                    x={peakPoint.time} 
                    y={peakPoint.score} 
                    r={8} 
                    fill="var(--color-warning)" 
                    stroke="#fff" 
                    strokeWidth={3} 
                    isFront={true}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {peakPoint && (
            <p style={{textAlign: 'center', marginTop: '1rem', color: 'var(--color-warning)', fontSize: '0.875rem', fontWeight: 'bold'}}>
              ★ Peak Attention: {peakPoint.score}% at {peakPoint.time}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="card flex flex-col" style={{marginBottom: 0}}>
          <h3 className="card-title" style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>Timeline Details</h3>
          <div style={{overflowX: 'auto', flex: 1}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Understood</th>
                  <th>Uncertain</th>
                  <th>Missed</th>
                  <th style={{textAlign: 'right'}}>Score</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <tr key={idx} style={{ transition: 'background-color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{fontWeight: 600}}>{row.time}</td>
                      <td style={{color: 'var(--color-accent)', fontWeight: 600}}>{row.understood_pct}%</td>
                      <td style={{color: 'var(--color-warning)', fontWeight: 600}}>{row.uncertain_pct}%</td>
                      <td style={{color: 'var(--color-danger)', fontWeight: 600}}>{row.not_understood_pct}%</td>
                      <td style={{textAlign: 'right', fontWeight: 800, color: 'var(--color-primary)'}}>{row.score}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', color: 'var(--color-text-gray)'}}>Recording needs to run for at least 30 seconds to generate a written report.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
