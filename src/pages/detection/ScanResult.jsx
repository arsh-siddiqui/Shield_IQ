import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2, Info, Search, Cpu, BookOpen, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { getScanResult } from "../../services/detectionService";
import Button from "../../components/ui/Button";

export default function ScanResult() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

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

  // Evidence — items have { source, title, detail, severity }
  const evidenceList = scan.evidence || [];
  const heuristics = evidenceList.filter(e => e.source === 'Heuristics');
  const ml = evidenceList.filter(e => e.source === 'ML_Classifier');
  const threatIntel = evidenceList.filter(e => e.source === 'PhishDestroy' || e.source === 'Threat_Intelligence' || e.source === 'VirusTotal');
  const personalization = evidenceList.filter(e => e.source === 'Personalization_RAG');
  
  const isUrlScan = scan.inputType === 'url' || scan.scanType === 'url';

  // Display fields — use stored target/scanType, fall back to heuristicResult
  const displayTarget = scan.target || scan.heuristicResult?.category || 'Scanned Content';
  const displayType = scan.scanType || scan.inputType || 'unknown';

  // LLM analysis — stored as llmResult (not groqAnalysis)
  let llmAnalysisStr = "No AI analysis available for this scan.";
  try {
    const llm = scan.llmResult;
    if (llm) {
      if (typeof llm === 'string') {
        llmAnalysisStr = llm;
      } else if (llm.summary) {
        llmAnalysisStr = llm.summary;
      } else if (llm.reason) {
        llmAnalysisStr = llm.reason;
      } else if (llm.reasoning) {
        llmAnalysisStr = llm.reasoning;
      } else {
        llmAnalysisStr = JSON.stringify(llm, null, 2);
      }
    }
  } catch {
    llmAnalysisStr = "AI analysis could not be parsed.";
  }

  // confidence (not confidenceScore)
  const confidenceDisplay = scan.confidence ?? scan.confidenceScore ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className={`p-8 rounded-3xl ${riskLightBg} border ${isDanger ? 'border-danger-200' : isMedium ? 'border-warning' : 'border-success-200'}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={`w-20 h-20 rounded-full ${riskBg} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <RiskIcon className="w-10 h-10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-sm font-bold uppercase tracking-wider mb-1 capitalize" style={{ color: riskColor }}>
              Scan Complete · {displayType}
            </div>
            <h1 className={`text-4xl font-extrabold mb-2 ${riskColor} capitalize`}>
              {scan.classification}
            </h1>
            <p className="text-ink-light font-medium truncate max-w-xl text-base">
              {displayTarget}
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-4 text-center">
            <div className="bg-white/80 p-4 rounded-xl shadow-sm min-w-[120px]">
              <div className="text-xs font-bold text-ink-light uppercase mb-1">Risk Score</div>
              <div className={`text-2xl font-extrabold ${riskColor}`}>{scan.riskScore}/100</div>
            </div>
            <div className="bg-white/80 p-4 rounded-xl shadow-sm min-w-[120px]">
              <div className="text-xs font-bold text-ink-light uppercase mb-1">Confidence</div>
              <div className="text-2xl font-extrabold text-ink">{confidenceDisplay}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink">What we checked</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-ink"><ShieldCheck className="w-4 h-4 text-success" /> {isUrlScan ? 'URL Structure & Domain Info' : 'Message Content & Wording'}</li>
              {!isUrlScan && <li className="flex items-center gap-2 text-sm text-ink"><ShieldCheck className="w-4 h-4 text-success" /> Sender & Recipient Context</li>}
              <li className="flex items-center gap-2 text-sm text-ink"><ShieldCheck className="w-4 h-4 text-success" /> Threat Intelligence Databases</li>
              {!isUrlScan && <li className="flex items-center gap-2 text-sm text-ink"><ShieldCheck className="w-4 h-4 text-success" /> Saved Email Patterns (if available)</li>}
            </ul>
          </div>

          {/* AI Reasoning */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink">Why this result? (AI Explanation)</h3>
            </div>
            <div className="text-sm text-ink-light leading-relaxed flex-1 whitespace-pre-wrap">
              {llmAnalysisStr}
            </div>
          </div>
          
          <button 
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <span className="font-bold text-ink">Technical Details</span>
            {showTechnicalDetails ? <ChevronUp className="w-5 h-5 text-ink-light" /> : <ChevronDown className="w-5 h-5 text-ink-light" />}
          </button>
          
          {showTechnicalDetails && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
              <EvidenceCard
                title={isUrlScan ? "URL Safety Checks" : "Message Safety Checks"}
                icon={Search}
                evidence={heuristics}
                emptyMsg="No heuristic signals detected — content appears normal."
              />

              {!isUrlScan && (
                <EvidenceCard
                  title="Machine Learning Classifier"
                  icon={Cpu}
                  evidence={ml}
                  emptyMsg="ML classifier was not applicable for this scan."
                />
              )}

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-ink">Threat Intelligence</h3>
                </div>
                {threatIntel.length > 0 ? (
                  <ul className="space-y-3">
                    {threatIntel.map((e, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <Info className={`w-5 h-5 flex-shrink-0 ${e.severity === 'high' || e.severity === 'critical' ? 'text-danger' : 'text-primary'}`} />
                        <div>
                          <span className="font-semibold text-ink">{e.title || e.type} ({e.source}):</span>{" "}
                          <span className="text-ink-light">{e.detail}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-light italic">No threat intelligence hits for this content.</p>
                )}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs font-medium text-ink-faint">
                  Not listed in threat intelligence does not guarantee safety.
                </div>
              </div>

              {!isUrlScan && (
                <EvidenceCard
                  title="Email Pattern Comparison"
                  icon={BookOpen}
                  evidence={personalization}
                  emptyMsg="No email history available. Add legitimate emails to My Email Patterns to enable personalized detection."
                />
              )}
            </div>
          )}
        </div>

        </div>
      </div>

      {/* Recommendations */}
      {scan.recommendations && scan.recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Recommendations
          </h2>
          <ul className="space-y-2">
            {scan.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-ink-light">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/detection/scanner">
          <Button variant="primary">Scan Another</Button>
        </Link>
        <Link to="/detection/history">
          <Button variant="secondary">View History</Button>
        </Link>
      </div>
    </div>
  );
}

function EvidenceCard({ title, icon: Icon, evidence, emptyMsg }) {
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
              <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                e.severity === 'high' ? 'text-danger' :
                e.severity === 'medium' ? 'text-warning-dark' :
                e.severity === 'info' ? 'text-primary' : 'text-success'
              }`} />
              <div>
                <span className="font-semibold text-ink">{e.title || e.type}:</span>{" "}
                <span className="text-ink-light">{e.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-light italic">{emptyMsg || "No evidence detected in this category."}</p>
      )}
    </div>
  );
}
