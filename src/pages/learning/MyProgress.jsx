import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { getAllProgress } from "../../services/progressService";
import { getVulnerabilities } from "../../services/vulnerabilityService";
import Button from "../../components/ui/Button";

export default function MyProgress() {
  const [progress, setProgress] = useState([]);
  const [vulns, setVulns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [progData, vulnData] = await Promise.all([
          getAllProgress(),
          getVulnerabilities()
        ]);
        setProgress(progData || []);
        setVulns(vulnData || []);
      } catch (err) {
        setError("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Map progress to vulnerability metadata
  const progressList = progress.map(p => {
    const v = vulns.find(vul => vul._id === p.vulnerabilityId) || {};
    return { ...p, title: v.title || "Unknown Module", slug: v.slug };
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            My Learning Progress
          </h1>
          <p className="text-ink-light mt-2">
            Track your vulnerability assessments and module completions.
          </p>
        </div>
        <Link to="/vulnerabilities">
          <Button variant="outline"><BookOpen className="w-4 h-4 mr-2"/> Browse Curriculum</Button>
        </Link>
      </header>

      {error && (
        <div className="bg-danger-50 text-danger p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {progressList.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink">No progress yet.</h3>
          <p className="text-sm text-ink-light mt-1 mb-6">Start a vulnerability module to track your progress here.</p>
          <Link to="/vulnerabilities">
            <Button variant="primary">Start Learning</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressList.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  item.status === 'completed' ? 'bg-success-50 text-success' : 'bg-warning-light text-warning-dark'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-ink-faint">
                  Score: <span className={item.assessmentScore >= 70 ? 'text-success' : 'text-danger'}>{item.assessmentScore}%</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink mb-1">{item.title}</h3>
              <p className="text-xs text-ink-light mb-4 flex-1">
                Theory: {item.theoryCompleted ? 'Done' : 'Pending'} <br />
                Attempts: {item.attempts}
              </p>
              
              {item.slug && (
                <Link to={`/vulnerabilities/${item.slug}`}>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    {item.status === 'completed' ? 'Review Module' : 'Continue Learning'}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
