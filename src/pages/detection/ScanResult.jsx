import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Info, Search, Cpu, BookOpen, MessageSquare } from "lucide-react";
import { getScanResult } from "../../services/detectionService";
import Button from "../../components/ui/Button";

export default function ScanResult() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getScanResult(id);
        setScan(data);
      } catch (err) {
        setError("Failed to load scan result.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-danger-50 text-danger p-6 rounded-2xl flex flex-col items-center text-center">
          <ShieldAlert className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Result Not Found</h2>
          <p className="text-sm mb-6">{error || "The scan result you are looking for does not exist or you do not have permission to view it."}</p>
          <Link to="/detection/history">
            <Button variant="primary">Back to History</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSafe = scan.riskLevel === 'safe' || scan.riskLevel === 'low';
  const isMedium = scan.riskLevel === 'medium';
  const isDanger = scan.riskLevel === 'high' || scan.riskLevel === 'critical';

  const riskColor = isDanger ? 'text-danger' : isMedium ? 'text-warning-dark' : 'text-success';
  const riskBg = isDanger ? 'bg-danger' : isMedium ? 'bg-warning-dark' : 'bg-success';
  const riskLightBg = isDanger ? 'bg-danger-50' : isMedium ? 'bg-warning-light' : 'bg-success-50';
  const RiskIcon = isDanger ? ShieldAlert : isMedium ? AlertTriangle : ShieldCheck;

  // Evidence Parsing
  const evidenceList = scan.evidence || [];
  const heuristics = evidenceList.filter(e => e.source === 'Heuristics');
  const ml = evidenceList.filter(e => e.source === 'ML_Classifier');
  const threatIntel = evidenceList.filter(e => e.source === 'PhishDestroy');
  const personalization = evidenceList.filter(e => e.source === 'Personalization_RAG');
  
  // Extract LLM analysis safely (it might be a string or an object depending on the backend state)
  let llmAnalysisStr = "No LLM analysis available.";
  try {
    if (scan.groqAnalysis) {
      const parsed = typeof scan.groqAnalysis === 'string' ? JSON.parse(scan.groqAnalysis) : scan.groqAnalysis;
      llmAnalysisStr = parsed.reasoning || parsed.summary || JSON.stringify(parsed);
    }
  } catch (e) {
    llmAnalysisStr = String(scan.groqAnalysis || "");
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Card */}
      <div className={`p-8 rounded-3xl ${riskLightBg} border ${isDanger ? 'border-danger-200' : isMedium ? 'border-warning' : 'border-success-200'}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={`w-20 h-20 rounded-full ${riskBg} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <RiskIcon className="w-10 h-10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: riskColor }}>
              Scan Complete
            </div>
            <h1 className={`text-4xl font-extrabold mb-2 ${riskColor} capitalize`}>
              {scan.classification}
            </h1>
            <p className="text-ink-light font-medium truncate max-w-xl text-lg">
              {scan.target}
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-4 text-center">
            <div className="bg-white/80 p-4 rounded-xl shadow-sm min-w-[120px]">
              <div className="text-xs font-bold text-ink-light uppercase mb-1">Risk Score</div>
              <div className={`text-2xl font-extrabold ${riskColor}`}>{scan.riskScore}/100</div>
            </div>
            <div className="bg-white/80 p-4 rounded-xl shadow-sm min-w-[120px]">
              <div className="text-xs font-bold text-ink-light uppercase mb-1">Confidence</div>
              <div className="text-2xl font-extrabold text-ink">{scan.confidenceScore}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Technical Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-primary" /> Detection Evidence
          </h2>

          <EvidenceCard title="Heuristic Analysis" icon={Search} evidence={heuristics} />
          <EvidenceCard title="Machine Learning" icon={Cpu} evidence={ml} />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink">Threat Intelligence (PhishDestroy)</h3>
            </div>
            {threatIntel.length > 0 ? (
              <ul className="space-y-3">
                {threatIntel.map((e, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <Info className={`w-5 h-5 flex-shrink-0 ${e.severity === 'high' ? 'text-danger' : 'text-primary'}`} />
                    <div>
                      <span className="font-semibold text-ink">{e.type}:</span> <span className="text-ink-light">{e.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-light italic">No threat intelligence hits.</p>
            )}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs font-medium text-ink-faint">
              Note: Not listed by threat intelligence does not mean safe.
            </div>
          </div>

          <EvidenceCard title="Personalized Context (RAG)" icon={BookOpen} evidence={personalization} />

        </div>

        {/* Right Column: LLM Reasoning */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink">AI Reasoning</h3>
            </div>
            <div className="prose prose-sm prose-slate max-w-none text-ink-light leading-relaxed flex-1 whitespace-pre-wrap">
              {llmAnalysisStr}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function EvidenceCard({ title, icon: Icon, evidence }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      {evidence.length > 0 ? (
        <ul className="space-y-3">
          {evidence.map((e, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <Info className={`w-5 h-5 flex-shrink-0 ${e.severity === 'high' ? 'text-danger' : e.severity === 'medium' ? 'text-warning-dark' : 'text-success'}`} />
              <div>
                <span className="font-semibold text-ink">{e.type}:</span> <span className="text-ink-light">{e.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-light italic">No evidence detected in this category.</p>
      )}
    </div>
  );
}
