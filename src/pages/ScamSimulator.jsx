import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { simulationScenarios } from "../data/dummyData";
import { difficultyTone, colorBg50, colorText } from "../utils/colorMaps";
import { useAppData } from "../context/AppDataContext";
import { useToast } from "../context/ToastContext";

const choiceButtons = [
  { id: "open", label: "Open / Click", icon: "MousePointerClick" },
  { id: "ignore", label: "Ignore It", icon: "EyeOff" },
  { id: "report", label: "Report as Phishing", icon: "Flag" },
];

export default function ScamSimulator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { simulationResults, completeSimulation, simulationsCompletedCount, allSimulationsComplete } = useAppData();
  const [activeId, setActiveId] = useState(null);

  const scenario = simulationScenarios.find((s) => s.id === activeId);
  const result = activeId ? simulationResults[activeId] : null;

  const handleChoice = (choiceId) => {
    const outcome = completeSimulation(activeId, choiceId);
    if (outcome) {
      toast(outcome.correct ? `Nice — +${outcome.xp} XP` : `+${outcome.xp} XP earned`, outcome.correct ? "success" : "info");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Scam Simulator</h1>
          <p className="text-sm text-ink-light mt-1">Pick a scenario and practice spotting the scam — zero real risk.</p>
        </div>
        <Badge tone={allSimulationsComplete ? "success" : "primary"} icon={Icons.Trophy}>
          {simulationsCompletedCount} / {simulationScenarios.length} completed
        </Badge>
      </div>

      {!activeId ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {simulationScenarios.map((cat, i) => {
              const Icon = Icons[cat.icon] || Icons.Shield;
              const done = simulationResults[cat.id];
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card hover onClick={() => setActiveId(cat.id)} className="p-6 cursor-pointer relative">
                    {done && (
                      <span className="absolute top-4 right-4">
                        <Icons.CheckCircle2 className={`w-5 h-5 ${done.correct ? "text-success" : "text-accent-600"}`} />
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-2xl ${colorBg50[cat.color]} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${colorText[cat.color]}`} />
                    </div>
                    <h3 className="font-bold text-ink mb-2">{cat.label}</h3>
                    <Badge tone={difficultyTone[cat.difficulty]}>{cat.difficulty}</Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {allSimulationsComplete && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <Card className="p-6 bg-gradient-to-br from-primary to-primary-700 text-white border-none flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">All scenarios complete!</h3>
                  <p className="text-primary-100 text-sm mt-1 opacity-90">Attack Replay is now unlocked — see how a real scam plays out end to end.</p>
                </div>
                <Button variant="accent" icon={Icons.History} onClick={() => navigate("/attack-replay")}>
                  Open Attack Replay
                </Button>
              </Card>
            </motion.div>
          )}
        </>
      ) : (
        <div>
          <button
            onClick={() => setActiveId(null)}
            className="flex items-center gap-1.5 text-sm text-ink-light hover:text-ink mb-6"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            Choose a different scenario
          </button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mock inbox */}
            <Card className="lg:col-span-2 overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 flex items-center gap-2 border-b border-slate-100">
                <Icons.Mail className="w-4 h-4 text-ink-light" />
                <span className="text-sm font-semibold text-ink-light">{scenario.app}</span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${colorBg50[scenario.color]} flex items-center justify-center flex-shrink-0`}>
                    {(() => {
                      const Icon = Icons[scenario.icon] || Icons.Landmark;
                      return <Icon className={`w-5 h-5 ${colorText[scenario.color]}`} />;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink truncate">{scenario.from}</span>
                      <span className="text-xs text-ink-faint flex-shrink-0">{scenario.time}</span>
                    </div>
                    <div className="text-sm font-bold text-ink mt-1">{scenario.subject}</div>
                  </div>
                </div>
                <p className="text-sm text-ink-light leading-relaxed whitespace-pre-line mt-4">{scenario.body}</p>
              </div>

              {!result && (
                <div className="border-t border-slate-100 p-5 flex flex-wrap gap-3">
                  {choiceButtons.map((c) => {
                    const Icon = Icons[c.icon] || Icons.MousePointerClick;
                    return (
                      <Button key={c.id} variant="outline" icon={Icon} onClick={() => handleChoice(c.id)}>
                        {c.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Feedback / info panel */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div key="feedback" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className={`p-6 ${result.correct ? "bg-success-50" : "bg-accent-50"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        {result.correct ? (
                          <Icons.CheckCircle2 className="w-8 h-8 text-success" />
                        ) : (
                          <Icons.AlertTriangle className="w-8 h-8 text-accent-600" />
                        )}
                        <div>
                          <div className="font-bold text-ink">{result.correct ? "Great job!" : "Not quite"}</div>
                          <div className="text-xs text-ink-light">+{result.xp} XP earned</div>
                        </div>
                      </div>
                      <p className="text-sm text-ink-light leading-relaxed">{result.message}</p>
                      <div className="flex gap-2 mt-5">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setActiveId(null)}>
                          Next Scenario
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6 mt-6">
                      <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
                        <Icons.BookOpen className="w-4 h-4 text-primary" />
                        Lessons Learned
                      </h3>
                      <div className="space-y-3">
                        {scenario.lessonsLearned.map((l) => (
                          <div key={l} className="flex items-start gap-2">
                            <Icons.Dot className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs text-ink-light leading-relaxed">{l}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-5" variant="secondary" icon={Icons.BookOpen} onClick={() => navigate("/learn")}>
                        Learn This Skill
                      </Button>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="p-6">
                      <h3 className="font-bold text-ink mb-2 flex items-center gap-2">
                        <Icons.HelpCircle className="w-4 h-4 text-primary" />
                        What would you do?
                      </h3>
                      <p className="text-sm text-ink-light leading-relaxed">
                        Read the message carefully. What would you do if this landed in your real inbox? Choose one
                        of the options to see how you did.
                      </p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
