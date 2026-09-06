import { useState, useEffect } from "react";
import { TrendingUp, Target, Loader2, AlertCircle } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { getAllProgress } from "../../services/progressService";
import { Link } from "react-router-dom";
import { getEmailHistory } from "../../services/emailHistoryService";

export default function SecurityProfile() {
  const { user } = useAppData();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailCount, setEmailCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [data, emails] = await Promise.all([
          getAllProgress(),
          getEmailHistory().catch(() => [])
        ]);
        setProgressData(data || []);
        setEmailCount(emails?.length || 0);
      } catch (err) {
        setError("Failed to load progress data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const strengths = user?.learningProfile?.strengths || [];
  const weaknesses = user?.learningProfile?.weaknesses || [];
  const recommendedFocus = user?.learningProfile?.recommendedFocus || "None";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          Security Profile
        </h1>
        <p className="text-ink-light mt-2">
          Your personalized vulnerability learning profile based on your assessment performance.
        </p>
      </header>

      {error && (
        <div className="bg-danger-50 text-danger p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-ink">Focus Areas</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-ink-light mb-2">Your Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {strengths.length > 0 ? strengths.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-success-50 text-success text-sm rounded-lg font-semibold">{s}</span>
                )) : <span className="text-sm text-ink-faint">Keep learning to identify strengths.</span>}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-ink-light mb-2">Areas for Improvement</h3>
              <div className="flex flex-wrap gap-2">
                {weaknesses.length > 0 ? weaknesses.map(w => (
                  <span key={w} className="px-3 py-1.5 bg-danger-50 text-danger text-sm rounded-lg font-semibold">{w}</span>
                )) : <span className="text-sm text-ink-faint">No critical weaknesses identified.</span>}
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-ink-light mb-1">AI Recommendation</h3>
            <div className="text-lg font-bold text-primary">{recommendedFocus}</div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink mb-6">Learning Analytics</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-semibold text-ink-light">Vulnerabilities Explored</span>
                <span className="text-lg font-extrabold text-ink">{progressData.length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-semibold text-ink-light">Assessments Passed</span>
                <span className="text-lg font-extrabold text-success">
                  {progressData.filter(p => p.status === 'completed' && p.assessmentScore >= 70).length}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-semibold text-ink-light">Assessments Failed</span>
                <span className="text-lg font-extrabold text-danger">
                  {progressData.filter(p => p.status === 'completed' && p.assessmentScore < 70).length}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/learning/progress" className="text-sm text-primary font-bold hover:underline">
              View Detailed Progress &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* Personalized Detection */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-ink mb-6">Personalized Detection</h2>
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-ink mb-1">My Email Patterns</h3>
            <div className="text-sm text-ink-light">
              <span className="font-semibold text-ink">{emailCount} stored</span> &middot; <span className="font-semibold text-primary">{emailCount} embeddings ready</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/detection/email-context" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-600 transition shadow-sm inline-block">
              Manage My Email Patterns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
