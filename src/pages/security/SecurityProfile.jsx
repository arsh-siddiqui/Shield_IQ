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
  const recommendedFocus = user?.learningProfile?.recommendedFocus || "Security Fundamentals";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    );
  }

  const totalVulnerabilities = 12; // Assuming 12 available courses for mock scaling
  const vulnerabilitiesExplored = progressData.length;
  const passedAssessments = progressData.filter(p => p.status === 'completed' && p.assessmentScore >= 70).length;
  const failedAssessments = progressData.filter(p => p.status === 'completed' && p.assessmentScore < 70).length;
  
  const overallMastery = totalVulnerabilities === 0 ? 0 : Math.round((passedAssessments / totalVulnerabilities) * 100);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-blue/10 text-accent-blue mb-4 shadow-soft border border-accent-blue/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
            Security Profile
          </h1>
          <p className="text-secondary font-medium">
            Your personalized vulnerability learning profile based on your assessment performance.
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Top Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Overall Mastery Gauge */}
        <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-elevated flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-[40px] pointer-events-none" />
          <h2 className="text-sm font-bold text-primary self-start mb-6 w-full relative z-10">Overall Mastery</h2>
          
          <div className="relative w-48 h-48 flex items-center justify-center mb-4 z-10">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary/20" />
              <circle 
                cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                className="text-accent-blue transition-all duration-1000 ease-out" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * overallMastery / 100)} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-primary">{overallMastery}%</span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mt-1">Mastery Score</span>
            </div>
          </div>
          
          <Link to="/learning/progress" className="w-full text-center py-3 bg-background border border-border text-primary rounded-xl font-bold text-sm hover:bg-secondary transition-colors mt-auto z-10">
            View Detailed Progress
          </Link>
        </div>

        {/* Focus Areas */}
        <div className="lg:col-span-2 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-elevated space-y-8 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-primary">Focus Areas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <div>
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span> Your Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {strengths.length > 0 ? strengths.map(s => (
                  <span key={s} className="px-3.5 py-1.5 bg-success/10 text-success text-xs rounded-lg font-bold border border-success/20">{s}</span>
                )) : <span className="text-sm font-medium text-muted bg-background border border-border px-4 py-2 rounded-xl">Keep learning to identify strengths.</span>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-danger"></span> Needs Improvement
              </h3>
              <div className="flex flex-wrap gap-2">
                {weaknesses.length > 0 ? weaknesses.map(w => (
                  <span key={w} className="px-3.5 py-1.5 bg-danger/10 text-danger text-xs rounded-lg font-bold border border-danger/20">{w}</span>
                )) : <span className="text-sm font-medium text-muted bg-background border border-border px-4 py-2 rounded-xl">No critical weaknesses identified.</span>}
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-background rounded-2xl border border-border mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">AI Recommendation</h3>
              <div className="text-base font-bold text-primary">{recommendedFocus}</div>
            </div>
            <Link to="/vulnerabilities" className="px-6 py-2.5 bg-accent-blue text-white text-xs font-bold rounded-xl shadow-soft hover:bg-accent-blue/90 transition-colors whitespace-nowrap">
              Start Course
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Progress Bars (Learning Analytics) */}
        <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-elevated">
          <h2 className="text-lg font-bold text-primary mb-8">Learning Analytics</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-primary">Vulnerabilities Explored</span>
                <span className="text-sm font-bold text-secondary">{vulnerabilitiesExplored} / {totalVulnerabilities}</span>
              </div>
              <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
                <div className="h-full bg-accent-blue rounded-full transition-all duration-1000" style={{ width: `${(vulnerabilitiesExplored / totalVulnerabilities) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-primary">Assessments Passed</span>
                <span className="text-sm font-bold text-success">{passedAssessments}</span>
              </div>
              <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${(passedAssessments / Math.max(1, vulnerabilitiesExplored)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-primary">Assessments Failed</span>
                <span className="text-sm font-bold text-danger">{failedAssessments}</span>
              </div>
              <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
                <div className="h-full bg-danger rounded-full transition-all duration-1000" style={{ width: `${(failedAssessments / Math.max(1, vulnerabilitiesExplored)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Personalized Detection */}
        <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-elevated flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary mb-3">Email Pattern Integration</h2>
            <p className="text-sm text-secondary font-medium leading-relaxed mb-6">
              Your learning profile and saved legitimate emails are directly used by our AI to build a unique behavioral baseline. This helps DetectIQ spot highly targeted spear-phishing that generic filters miss.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background p-4 border border-border rounded-2xl flex flex-col">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Stored Patterns</span>
                <span className="text-3xl font-black text-primary">{emailCount}</span>
              </div>
              <div className="bg-background p-4 border border-border rounded-2xl flex flex-col">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Active Model</span>
                <span className="text-3xl font-black text-accent-blue flex items-center gap-2">
                  Ready <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse mt-1" />
                </span>
              </div>
            </div>
          </div>
          
          <Link to="/detection/email-context" className="w-full bg-background border border-border text-primary px-6 py-3.5 rounded-xl font-bold hover:bg-secondary transition-all text-sm flex items-center justify-center">
            Manage Email Patterns
          </Link>
        </div>

      </div>
    </div>
  );
}
