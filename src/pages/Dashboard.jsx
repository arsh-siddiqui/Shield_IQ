import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, BookOpen, Target, Activity, ShieldCheck, History } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { getScanHistory } from "../services/detectionService";
import { getAllProgress } from "../services/progressService";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAppData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [scanHistory, setScanHistory] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [scans, progress] = await Promise.all([
          getScanHistory().catch(() => []),
          getAllProgress().catch(() => [])
        ]);
        setScanHistory(scans || []);
        setLearningProgress(progress || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Calculate Metrics
  const totalScans = scanHistory.length;
  const phishingScans = scanHistory.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;
  const suspiciousScans = scanHistory.filter(s => s.riskLevel === 'medium').length;
  const legitimateScans = scanHistory.filter(s => s.riskLevel === 'safe' || s.riskLevel === 'low').length;

  const completedLearning = learningProgress.filter(p => p.status === 'completed').length;
  const inProgressLearning = learningProgress.filter(p => p.status === 'in_progress').length;
  const attemptedLearning = learningProgress.filter(p => p.attempts > 0);
  const avgScore = attemptedLearning.length > 0
    ? Math.round(attemptedLearning.reduce((acc, curr) => acc + curr.assessmentScore, 0) / attemptedLearning.length)
    : 0;

  const strengths = user?.learningProfile?.strengths || [];
  const weaknesses = user?.learningProfile?.weaknesses || [];
  const recommendedFocus = user?.learningProfile?.recommendedFocus || "None";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-ink-light">Here is your security and learning overview.</p>
      </header>

      {error && (
        <div className="bg-danger-50 text-danger p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Detection Overview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-ink">Detection Overview</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Scans" value={totalScans} />
          <StatCard title="Phishing" value={phishingScans} color="text-danger" />
          <StatCard title="Suspicious" value={suspiciousScans} color="text-warning-dark" />
          <StatCard title="Legitimate" value={legitimateScans} color="text-success" />
        </div>
      </section>

      {/* Learning Overview */}
      <section>
        <div className="flex items-center gap-2 mb-4 mt-8">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-ink">Vulnerability Learning</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Completed" value={completedLearning} />
          <StatCard title="In Progress" value={inProgressLearning} />
          <StatCard title="Avg Assessment Score" value={avgScore > 0 ? `${avgScore}%` : '-'} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Security Profile */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-ink">Security Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-ink-light mb-1">Strengths</div>
              <div className="flex flex-wrap gap-2">
                {strengths.length > 0 ? strengths.map(s => (
                  <span key={s} className="px-2 py-1 bg-success-50 text-success text-xs rounded-md font-semibold">{s}</span>
                )) : <span className="text-sm text-ink-faint">No strengths identified yet.</span>}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-light mb-1">Weaknesses</div>
              <div className="flex flex-wrap gap-2">
                {weaknesses.length > 0 ? weaknesses.map(w => (
                  <span key={w} className="px-2 py-1 bg-danger-50 text-danger text-xs rounded-md font-semibold">{w}</span>
                )) : <span className="text-sm text-ink-faint">No weaknesses identified.</span>}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <div className="text-sm font-semibold text-ink-light mb-1">Recommended Focus</div>
              <div className="text-base font-bold text-primary">{recommendedFocus}</div>
              <p className="text-xs text-ink-faint mt-1">
                Based on your recent assessment performance.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-ink">Recent Scans</h2>
            </div>
            <Link to="/detection/history" className="text-sm text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>
          
          {scanHistory.length === 0 ? (
            <div className="text-sm text-ink-faint italic py-4">No scans yet. Submit an email or URL to get started.</div>
          ) : (
            <div className="space-y-3">
              {scanHistory.slice(0, 5).map(scan => (
                <Link to={`/detection/result/${scan._id}`} key={scan._id} className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-ink truncate max-w-[200px]">
                      {scan.target}
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-md capitalize ${
                      scan.riskLevel === 'high' || scan.riskLevel === 'critical' ? 'bg-danger-50 text-danger' :
                      scan.riskLevel === 'medium' ? 'bg-warning-light text-warning-dark' :
                      'bg-success-50 text-success'
                    }`}>
                      {scan.riskLevel}
                    </div>
                  </div>
                  <div className="text-xs text-ink-faint mt-1">
                    {new Date(scan.createdAt).toLocaleDateString()} · {scan.scanType}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

function StatCard({ title, value, color = "text-ink" }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
      <div className="text-sm font-semibold text-ink-light mb-1">{title}</div>
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
