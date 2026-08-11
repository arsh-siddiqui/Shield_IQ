import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { sampleScanResult } from "../data/dummyData";

const severityTone = { high: "danger", medium: "accent", low: "secondary" };

// ---------------------------------------------------------------------------
// Category Normalization
// ---------------------------------------------------------------------------

function formatCategory(rawCategory, isSafe) {
  if (isSafe) return "Safe / No Major Threat";
  if (!rawCategory || typeof rawCategory !== "string") return "General Security Check";

  const catLower = rawCategory.toLowerCase();
  if (catLower.includes("phish")) return "Phishing";
  if (
    catLower.includes("url") ||
    catLower.includes("link") ||
    catLower.includes("typosquat") ||
    catLower.includes("domain") ||
    catLower.includes("network")
  ) {
    return "Suspicious Link";
  }
  if (catLower.includes("otp") || catLower.includes("2fa")) return "OTP Scam";
  if (
    catLower.includes("payment") ||
    catLower.includes("upi") ||
    catLower.includes("bank") ||
    catLower.includes("card") ||
    catLower.includes("fee")
  ) {
    return "Payment Scam";
  }
  if (catLower.includes("invest") || catLower.includes("crypto") || catLower.includes("trading")) {
    return "Investment Scam";
  }
  if (catLower.includes("job") || catLower.includes("work") || catLower.includes("hiring")) {
    return "Job Scam";
  }
  if (catLower.includes("social") || catLower.includes("urgency") || catLower.includes("impersonat")) {
    return "Social Engineering";
  }
  if (catLower.includes("sms") || catLower.includes("text") || catLower.includes("message")) {
    return "Suspicious Message";
  }

  return "General Security Check";
}

// ---------------------------------------------------------------------------
// Risk Display Configuration (No Numerical Scores)
// ---------------------------------------------------------------------------

function getRiskDisplayConfig(rawRiskLevel) {
  const level = (rawRiskLevel || "Safe").toString().trim().toUpperCase();

  if (level.includes("HIGH")) {
    return {
      statusLabel: "HIGH RISK",
      subtitle: "Strong signs of a scam detected",
      tone: "danger",
      icon: Icons.ShieldAlert,
      isSafe: false,
    };
  }

  if (level.includes("MEDIUM")) {
    return {
      statusLabel: "BE CAREFUL",
      subtitle: "Multiple warning signs detected",
      tone: "warning",
      icon: Icons.ShieldAlert,
      isSafe: false,
    };
  }

  if (level.includes("LOW")) {
    return {
      statusLabel: "LOW RISK",
      subtitle: "A few warning signs detected",
      tone: "info",
      icon: Icons.ShieldCheck,
      isSafe: false,
    };
  }

  // SAFE
  return {
    statusLabel: "SAFE",
    subtitle: "No significant warning signs detected",
    tone: "success",
    icon: Icons.ShieldCheck,
    isSafe: true,
  };
}

// ---------------------------------------------------------------------------
// Evidence Panel — "How ShieldIQ reached this result"
// Friendly user-facing labels without raw probabilities or numerical scores.
// ---------------------------------------------------------------------------

function EvidenceCard({ icon: Icon, title, subtitle, badge, badgeColor = "slate" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-ink">{title}</div>
        <div className="text-xs text-ink-light mt-0.5 leading-relaxed">{subtitle}</div>
      </div>
      {badge && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
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

  const cards = [];

  // 1. Warning Signs (Heuristic Analysis)
  const signalCount = heuristics?.signalCount ?? (result?.detectedSignals?.length ?? 0);
  cards.push({
    id: "heuristics",
    icon: Icons.ShieldAlert,
    title: "🛡️ Warning Signs",
    subtitle:
      signalCount === 0
        ? "No suspicious warning signs detected in content structure."
        : `${signalCount} warning sign${signalCount !== 1 ? "s" : ""} identified during scan.`,
    badge: signalCount === 0 ? "Clean" : "Warning Signs Found",
    badgeColor: signalCount === 0 ? "success" : "danger",
  });

  // 2. Message Analysis (Machine Learning)
  if (ml?.status === "available" && sources.includes("machine_learning")) {
    const isPhishing = ml.label === "phishing";
    cards.push({
      id: "ml",
      icon: Icons.Bot,
      title: "🤖 Message Analysis",
      subtitle: isPhishing
        ? "Message analysis model detected patterns commonly found in phishing scams."
        : "Message analysis model found no suspicious language patterns in message content.",
      badge: isPhishing ? "Flags Detected" : "Clear",
      badgeColor: isPhishing ? "danger" : "success",
    });
  } else if (ml?.status === "unavailable") {
    const relevantTypes = new Set(["email", "sms", "whatsapp"]);
    if (relevantTypes.has(result?.scanType)) {
      cards.push({
        id: "ml_unavailable",
        icon: Icons.Bot,
        title: "🤖 Message Analysis",
        subtitle: "Message analysis model was unavailable. Structural check provided the assessment.",
        badge: "Skipped",
        badgeColor: "slate",
      });
    }
  }

  // 3. Threat Check (Threat Intelligence / PhishDestroy)
  if (intelligence?.phishdestroy) {
    const pd = intelligence.phishdestroy;
    if (pd.status === "found" && pd.malicious) {
      cards.push({
        id: "phishdestroy",
        icon: Icons.Globe,
        title: "🌐 Threat Check",
        subtitle: "Known threat found in external security threat database.",
        badge: "Known Threat",
        badgeColor: "danger",
      });
    } else if (pd.status === "not_found" && sources.includes("phishdestroy")) {
      cards.push({
        id: "phishdestroy",
        icon: Icons.Globe,
        title: "🌐 Threat Check",
        subtitle: "No known threat found in threat database. (Not listed does not necessarily mean safe.)",
        badge: "Not Listed",
        badgeColor: "success",
      });
    }
  } else if (sources.includes("phishdestroy")) {
    cards.push({
      id: "phishdestroy",
      icon: Icons.Globe,
      title: "🌐 Threat Check",
      subtitle: "No known threat found in threat database.",
      badge: "Clean Check",
      badgeColor: "success",
    });
  }

  // 4. ShieldIQ Explanation (Groq AI)
  if (sources.includes("groq")) {
    cards.push({
      id: "groq",
      icon: Icons.MessageSquare,
      title: "💬 ShieldIQ Explanation",
      subtitle: "ShieldIQ AI analysed message context and generated the safe breakdown.",
      badge: "AI Explained",
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
      <div className="space-y-2.5">
        {cards.map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <EvidenceCard {...card} />
          </motion.div>
        ))}
      </div>
      <p className="text-[11px] text-ink-faint mt-3 leading-relaxed">
        Not listed in a threat database does not necessarily mean safe. Always exercise caution before sharing sensitive credentials or making payments.
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main ScanResult Page Component
// ---------------------------------------------------------------------------

export default function ScanResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(null);

  const r = location.state?.result || sampleScanResult;
  const target = location.state?.target;

  const displayConfig = getRiskDisplayConfig(r.riskLevel);
  const cleanCategory = formatCategory(r.category, displayConfig.isSafe);
  const StatusIcon = displayConfig.icon;

  const reasonsList = Array.isArray(r.reasons) ? r.reasons : [];
  const recsList = Array.isArray(r.recommendations) && r.recommendations.length > 0
    ? r.recommendations
    : displayConfig.isSafe
    ? ["You can proceed, but verify official websites directly.", "Never enter passwords or OTPs on links sent via SMS."]
    : ["Do not click any links inside this message.", "Do not enter OTPs, passwords, or personal details."];

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
        
        {/* Hero Risk Status Card (NO NUMERICAL SCORES / GAUGES) */}
        <Card
          className={`p-8 flex flex-col items-center text-center lg:col-span-1 border-t-4 ${
            displayConfig.tone === "danger"
              ? "border-t-danger"
              : displayConfig.tone === "warning"
              ? "border-t-amber-500"
              : displayConfig.tone === "info"
              ? "border-t-blue-500"
              : "border-t-green-500"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${
              displayConfig.tone === "danger"
                ? "bg-danger-50 text-danger"
                : displayConfig.tone === "warning"
                ? "bg-amber-50 text-amber-600"
                : displayConfig.tone === "info"
                ? "bg-blue-50 text-blue-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            <StatusIcon className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-ink mb-1">
            {displayConfig.statusLabel}
          </h2>
          <p className="text-xs font-semibold text-ink-light mb-6 leading-relaxed max-w-xs">
            {displayConfig.subtitle}
          </p>

          <div className="w-full pt-4 mt-auto border-t border-slate-100 flex flex-col items-center">
            <div className="text-[10px] text-ink-faint uppercase font-bold tracking-wider mb-1">Category</div>
            <div className="text-sm font-bold text-ink">{cleanCategory}</div>
          </div>
        </Card>

        {/* Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview */}
          <Card className="p-6">
            <h3 className="font-bold text-ink mb-2">What we found</h3>
            <p className="text-sm text-ink-light leading-relaxed">
              {r.summary || (displayConfig.isSafe ? "ShieldIQ analyzed this content and found no major signs of phishing or fraud." : "ShieldIQ detected suspicious signals in this content.")}
            </p>
          </Card>

          {/* Why ShieldIQ says this (Reasons) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink">Why ShieldIQ says this</h3>
              <span className="text-xs text-ink-faint">
                {reasonsList.length > 0 ? `${reasonsList.length} warning signs identified` : "0 warning signs"}
              </span>
            </div>

            {reasonsList.length > 0 ? (
              <div className="space-y-3">
                {reasonsList.map((reason, i) => {
                  const titleStr = typeof reason === "string" ? reason : reason.title || "Suspicious Signal";
                  const detailStr = typeof reason === "object" ? reason.detail : null;
                  const severity = typeof reason === "object" ? reason.severity : "medium";
                  const isOpen = expanded === titleStr;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <button
                        type="button"
                        onClick={() => detailStr && setExpanded(isOpen ? null : titleStr)}
                        className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              severityTone[severity] === "danger" ? "bg-danger-50" : "bg-amber-50"
                            }`}
                          >
                            <Icons.AlertTriangle
                              className={`w-4 h-4 ${
                                severityTone[severity] === "danger" ? "text-danger" : "text-amber-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-ink">{titleStr}</div>
                            {detailStr && (
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="text-xs text-ink-light mt-1.5 leading-relaxed">{detailStr}</div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            )}
                          </div>
                          {detailStr && (
                            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <Icons.ChevronDown className="w-4 h-4 text-ink-faint flex-shrink-0 mt-1" />
                            </motion.span>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/70 border border-green-100 text-xs font-semibold text-green-900">
                  <Icons.CheckCircle2 className="w-4.5 h-4.5 text-green-600 flex-shrink-0" />
                  No suspicious requests or credential paths detected
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/70 border border-green-100 text-xs font-semibold text-green-900">
                  <Icons.CheckCircle2 className="w-4.5 h-4.5 text-green-600 flex-shrink-0" />
                  No major urgency or impersonation language detected
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/70 border border-green-100 text-xs font-semibold text-green-900">
                  <Icons.CheckCircle2 className="w-4.5 h-4.5 text-green-600 flex-shrink-0" />
                  No known threat match found in database
                </div>
              </div>
            )}
          </Card>

          {/* What should you do? (Recommendations) */}
          <Card className="p-6">
            <h3 className="font-bold text-ink mb-4">What should you do?</h3>
            <div className="space-y-3">
              {recsList.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icons.CheckCircle2 className="w-4.5 h-4.5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-ink-light leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* How ShieldIQ reached this result (Evidence Panel) */}
          <EvidencePanel result={r} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              icon={Icons.Bot}
              onClick={() =>
                navigate("/assistant", {
                  state: {
                    scanContext: {
                      target,
                      type: r.scanType || r.type || "Text/URL",
                      riskLevel: r.riskLevel,
                      riskScore: r.riskScore,
                      category: cleanCategory,
                      summary: r.summary,
                      reasons: r.reasons,
                      recommendations: recsList,
                    },
                  },
                })
              }
            >
              Ask ShieldIQ Assistant
            </Button>
            <Button variant="outline" icon={Icons.FileSearch} onClick={() => navigate("/decoder")}>
              Open Scam Decoder
            </Button>
            <Button variant="secondary" icon={Icons.Gamepad2} onClick={() => navigate("/simulator")}>
              Try Simulation
            </Button>
          {/* Contextual Learn Mapping */}
          {(() => {
            let learnTargetId = "ph-1";
            let learnTargetLabel = "Learn How Phishing Works";

            const categoryLower = (cleanCategory || "").toLowerCase();
            const typeLower = (r.scanType || r.type || "").toLowerCase();
            const signals = r.detectedSignals || [];

            if (categoryLower.includes("otp") || signals.includes("otp_request")) {
              learnTargetId = "up-3";
              learnTargetLabel = "Learn How OTP Scams Work";
            } else if (typeLower === "url" || categoryLower.includes("url") || signals.includes("typosquatting")) {
              learnTargetId = "sb-1";
              learnTargetLabel = "Learn How Fake Websites Work";
            } else if (categoryLower.includes("job") || categoryLower.includes("investment")) {
              learnTargetId = "ms-1";
              learnTargetLabel = "Learn How Investment Scams Work";
            } else if (typeLower === "email" || categoryLower.includes("phishing")) {
              learnTargetId = "ph-1";
              learnTargetLabel = "Learn How Phishing Works";
            }

            return (
              <Button
                variant="outline"
                icon={Icons.BookOpen}
                onClick={() => navigate("/learn", { state: { openLessonId: learnTargetId } })}
              >
                {learnTargetLabel}
              </Button>
            );
          })()}
          <Button variant="outline" icon={Icons.RotateCcw} onClick={() => navigate("/scanner")}>
            Scan Again
          </Button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
