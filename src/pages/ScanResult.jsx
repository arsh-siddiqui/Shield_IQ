import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import RiskMeter from "../components/ui/RiskMeter";
import ProgressRing from "../components/ui/ProgressRing";
import { sampleScanResult } from "../data/dummyData";
import { riskTone } from "../utils/colorMaps";

const severityTone = { high: "danger", medium: "accent", low: "secondary" };

// ---------------------------------------------------------------------------
// Evidence Panel — "How ShieldIQ reached this result"
// Shows only sources that were actually available / contributed evidence.
// ---------------------------------------------------------------------------

function EvidenceCard({ icon: Icon, title, subtitle, badge, badgeColor = "slate" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-ink">{title}</div>
        <div className="text-xs text-ink-light mt-0.5 leading-relaxed">{subtitle}</div>
      </div>
      {badge && (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
            badgeColor === "danger"
              ? "bg-danger-50 text-danger"
              : badgeColor === "success"
              ? "bg-green-50 text-green-700"
              : badgeColor === "warning"
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {badge}
        </span>
      )}
    </motion.div>
  );
}

function EvidencePanel({ result }) {
  const sources = result?.analysisSources || [];
  const ml = result?.ml;
  const intelligence = result?.intelligence;
  const heuristics = result?.heuristics;

  // Build list of displayed evidence cards
  const cards = [];

  // Always show heuristics (always runs)
  const signalCount = heuristics?.signalCount ?? (result?.detectedSignals?.length ?? 0);
  cards.push({
    id: "heuristics",
    icon: Icons.ScanSearch,
    title: "Heuristic Analysis",
    subtitle:
      signalCount === 0
        ? "No suspicious signals detected in content structure."
        : `${signalCount} suspicious signal${signalCount !== 1 ? "s" : ""} detected (${heuristics?.riskLevel || result?.riskLevel} risk).`,
    badge: "Always Active",
    badgeColor: "slate",
  });

  // ML evidence — only if it ran and was available
  if (ml?.status === "available" && sources.includes("machine_learning")) {
    const isPhishing = ml.label === "phishing";
    const pct = Math.round((ml.probability ?? 0) * 100);
    cards.push({
      id: "ml",
      icon: Icons.BrainCircuit,
      title: "Machine Learning",
      subtitle: isPhishing
        ? `ML model detected phishing-like language (${pct}% phishing probability).`
        : `ML model found no phishing language patterns (${pct}% phishing probability).`,
      badge: isPhishing ? "Phishing Detected" : "No ML Flags",
      badgeColor: isPhishing ? "danger" : "success",
    });
  } else if (ml?.status === "unavailable") {
    // Only show if ML was expected but unavailable (email/sms/whatsapp scan types)
    const relevantTypes = new Set(["email", "sms", "whatsapp"]);
    if (relevantTypes.has(result?.scanType)) {
      cards.push({
        id: "ml_unavailable",
        icon: Icons.BrainCircuit,
        title: "Machine Learning",
        subtitle: "ML service was unavailable. Heuristic engine provided the assessment.",
        badge: "Unavailable",
        badgeColor: "slate",
      });
    }
  }

  // PhishDestroy — only if TI ran and produced a real result
  if (intelligence?.phishdestroy) {
    const pd = intelligence.phishdestroy;
    if (pd.status === "found" && pd.malicious) {
      cards.push({
        id: "phishdestroy",
        icon: Icons.ShieldAlert,
        title: "PhishDestroy Threat Intelligence",
        subtitle: `Known suspicious domain. Risk score: ${pd.riskScore}/100. Severity: ${pd.severity}.`,
        badge: "Known Threat",
        badgeColor: "danger",
      });
    } else if (pd.status === "not_found" && sources.includes("phishdestroy")) {
      cards.push({
        id: "phishdestroy",
        icon: Icons.ShieldCheck,
        title: "PhishDestroy Threat Intelligence",
        subtitle: "✓ No known threat found in external databases. (Not found ≠ safe.)",
        badge: "Not Listed",
        badgeColor: "success",
      });
    }
  }

  // Groq — only if it ran
  if (sources.includes("groq")) {
    cards.push({
      id: "groq",
      icon: Icons.Zap,
      title: "AI Context Analysis",
      subtitle: "Groq analysed overall content context and contributed to the final explanation.",
      badge: "AI Assisted",
      badgeColor: "warning",
    });
  }

  if (cards.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icons.LayoutList className="w-4 h-4 text-ink-faint" />
        <h3 className="font-bold text-ink text-sm">How ShieldIQ reached this result</h3>
      </div>
      <div className="space-y-2">
        {cards.map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <EvidenceCard {...card} />
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] text-ink-faint mt-3 leading-relaxed">
        ShieldIQ uses risk assessment based on available evidence — not guaranteed detection.
        Results indicate phishing likelihood, not confirmed criminal activity.
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main ScanResult Page
// ---------------------------------------------------------------------------

export default function ScanResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(null);

  const r = location.state?.result || sampleScanResult;
  const target = location.state?.target;
  const tone = riskTone[r.riskLevel.replace(" Risk", "")] || "danger";

  return (
    <AppLayout>
      <button onClick={() => navigate("/scanner")} className="flex items-center gap-1.5 text-sm text-ink-light hover:text-ink mb-6">
        <Icons.ArrowLeft className="w-4 h-4" />
        Back to Scanner
      </button>

      {target && (
        <p className="text-xs text-ink-faint mb-4 -mt-2 truncate max-w-xl">
          Result for: <span className="font-medium text-ink-light">{target}</span>
        </p>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk summary card */}
        <Card className="p-8 flex flex-col items-center text-center lg:col-span-1">
          <RiskMeter score={r.riskScore} />
          <Badge tone={tone} icon={Icons.ShieldAlert} className="mt-4">
            {r.riskLevel}
          </Badge>

          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100 items-center">
            <div className="flex flex-col items-center">
              <ProgressRing progress={r.confidence} size={64} color="#2563EB" label={`${r.confidence}%`} />
              <div className="text-xs text-ink-faint mt-2">Confidence</div>
            </div>
            <div>
              <div className="text-sm font-bold text-ink leading-tight">{r.category}</div>
              <div className="text-xs text-ink-faint mt-1">Category</div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-ink mb-2">What we found</h3>
            <p className="text-sm text-ink-light leading-relaxed">{r.summary}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink">Reasons for this score</h3>
              <span className="text-xs text-ink-faint">{r.reasons.length} found · tap to expand</span>
            </div>
            <div className="space-y-3">
              {r.reasons.map((reason, i) => {
                const isOpen = expanded === reason.title;
                return (
                  <motion.button
                    key={reason.title}
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : reason.title)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          severityTone[reason.severity] === "danger" ? "bg-danger-50" : "bg-accent-50"
                        }`}
                      >
                        <Icons.AlertTriangle
                          className={`w-4 h-4 ${
                            severityTone[reason.severity] === "danger" ? "text-danger" : "text-accent-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink">{reason.title}</div>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="text-xs text-ink-light mt-1.5 leading-relaxed">{reason.detail}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <Icons.ChevronDown className="w-4 h-4 text-ink-faint flex-shrink-0 mt-1" />
                      </motion.span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-ink mb-4">What you should do</h3>
            <div className="space-y-3">
              {r.recommendations.map((rec) => (
                <div key={rec} className="flex items-start gap-3">
                  <Icons.CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-ink-light">{rec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Evidence panel — only shown when multi-layer data is present */}
          <EvidencePanel result={r} />

          <div className="flex flex-wrap gap-3">
            <Button icon={Icons.FileSearch} onClick={() => navigate("/decoder")}>
              Open Scam Decoder
            </Button>
            <Button variant="secondary" icon={Icons.Gamepad2} onClick={() => navigate("/simulator")}>
              Try Simulation
            </Button>
            <Button variant="outline" icon={Icons.BookOpen} onClick={() => navigate("/learn")}>
              Learn About This
            </Button>
            <Button variant="outline" icon={Icons.RotateCcw} onClick={() => navigate("/scanner")}>
              Scan Again
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
