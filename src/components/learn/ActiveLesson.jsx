import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { useAppData } from "../../context/AppDataContext";
import FindRedFlagsActivity from "./FindRedFlagsActivity";
import MiniQuizActivity from "./MiniQuizActivity";

// ─── Stage configuration ───────────────────────────────────────────────────
const STAGES = [
  { id: "intro",          label: "Intro",      icon: "BookOpen" },
  { id: "understand",     label: "Understand", icon: "Lightbulb" },
  { id: "seeIt",          label: "See It",     icon: "Eye" },
  { id: "tryItYourself",  label: "Try It",     icon: "MousePointer2" },
  { id: "realWorld",      label: "Real World", icon: "Globe" },
  { id: "quiz",           label: "Quiz",       icon: "CheckSquare" },
  { id: "takeaway",       label: "Takeaway",   icon: "ShieldCheck" },
];

// ─── Difficulty badge ──────────────────────────────────────────────────────
const difficultyColor = {
  Beginner:     "bg-success-50 text-success-700 border-success-200",
  Intermediate: "bg-accent-50 text-accent-700 border-accent-200",
  Advanced:     "bg-danger-50 text-danger-700 border-danger-200",
};

// ─── Step Progress Bar ─────────────────────────────────────────────────────
function StepProgressBar({ stages, currentStage }) {
  const currentIdx = stages.findIndex(s => s.id === currentStage);
  return (
    <div className="flex items-center gap-1 mb-8">
      {stages.map((stage, idx) => {
        const Icon = Icons[stage.icon] || Icons.Circle;
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={stage.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isCompleted ? "bg-primary border-primary text-white" :
                isCurrent   ? "bg-white border-primary text-primary shadow-sm shadow-primary/30" :
                              "bg-slate-50 border-slate-200 text-slate-300"
              }`}>
                {isCompleted
                  ? <Icons.Check className="w-3.5 h-3.5" />
                  : <Icon className="w-3.5 h-3.5" />
                }
              </div>
              <span className={`text-[10px] font-semibold mt-1 hidden sm:block ${
                isCurrent ? "text-primary" : isCompleted ? "text-ink-light" : "text-ink-faint"
              }`}>
                {stage.label}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all duration-500 ${
                idx < currentIdx ? "bg-primary" : "bg-slate-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Highlightable text for SeeIt ─────────────────────────────────────────
function HighlightableText({ text, redFlags, revealAll }) {
  const contentSegments = useMemo(() => {
    if (!redFlags || redFlags.length === 0) return [{ isFlag: false, text }];
    let segments = [];
    let lastIndex = 0;
    const flagsWithPos = redFlags
      .map((flag, idx) => ({ ...flag, idx, pos: text.indexOf(flag.text) }))
      .filter(f => f.pos !== -1)
      .sort((a, b) => a.pos - b.pos);
    flagsWithPos.forEach(flag => {
      if (flag.pos > lastIndex) segments.push({ isFlag: false, text: text.slice(lastIndex, flag.pos) });
      segments.push({ isFlag: true, text: flag.text, idx: flag.idx, reason: flag.reason });
      lastIndex = flag.pos + flag.text.length;
    });
    if (lastIndex < text.length) segments.push({ isFlag: false, text: text.slice(lastIndex) });
    return segments;
  }, [text, redFlags]);

  return (
    <p className="text-sm leading-loose font-mono">
      {contentSegments.map((seg, i) => {
        if (!seg.isFlag) return <span key={i} className="text-ink whitespace-pre-wrap">{seg.text}</span>;
        return (
          <span
            key={i}
            className={`relative px-1 mx-0.5 rounded transition-all duration-500 ${
              revealAll
                ? "bg-danger-100 text-danger-900 font-bold border-b-2 border-danger"
                : "text-ink"
            }`}
          >
            {seg.text}
            {revealAll && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + seg.idx * 0.1 }}
                className="absolute -top-3 -right-3 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-[10px]"
              >
                <Icons.AlertTriangle className="w-3 h-3" />
              </motion.span>
            )}
          </span>
        );
      })}
    </p>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ActiveLesson({ lesson, steps, onBack }) {
  const { completeLesson, updateSkill } = useAppData();
  const [currentStage, setCurrentStage] = useState(
    steps?.intro ? "intro" : "understand"
  );
  const [realWorldSelection, setRealWorldSelection] = useState(null);

  const hasIntro = !!(steps?.intro?.objectives?.length);
  const activeStageDefs = hasIntro ? STAGES : STAGES.filter(s => s.id !== "intro");

  const finishLesson = () => {
    completeLesson(lesson.slug || lesson.id, 30);
    updateSkill("Phishing Detection", 10);
    setCurrentStage("completed");
  };

  const next = (stage) => {
    setCurrentStage(stage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine what the lesson objectives are from intro or steps
  const objectives = steps?.intro?.objectives || [];
  const tagline = steps?.intro?.tagline || lesson.description;

  return (
    <div className="max-w-2xl mx-auto py-6">

      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm font-semibold text-ink-light flex items-center gap-1.5 mb-6 hover:text-primary transition-colors group"
      >
        <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Learn
      </button>

      {/* Lesson header */}
      {currentStage !== "completed" && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">{lesson.topic || "Learn"}</span>
            <span className="text-ink-faint">·</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${difficultyColor[lesson.difficulty] || difficultyColor.Beginner}`}>
              {lesson.difficulty || "Beginner"}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-faint font-medium">
              <Icons.Clock className="w-3 h-3" /> {lesson.estimatedTime || "3 min"}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-ink mb-1">{lesson.title}</h2>
          <p className="text-ink-light text-sm">{tagline}</p>
        </div>
      )}

      {/* Step progress */}
      {currentStage !== "completed" && (
        <StepProgressBar stages={activeStageDefs} currentStage={currentStage} />
      )}

      <AnimatePresence mode="wait">

        {/* ── STEP 1: INTRO ─────────────────────────────────────────────── */}
        {currentStage === "intro" && hasIntro && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8 bg-gradient-to-br from-primary-50 to-white border-primary/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                  <Icons.BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">Lesson Overview</div>
                  <h3 className="text-lg font-bold text-ink">{lesson.title}</h3>
                </div>
              </div>

              <p className="text-ink-light mb-8 leading-relaxed">{tagline}</p>

              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint mb-4">What You'll Learn</h4>
                <div className="space-y-3">
                  {objectives.map((obj, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icons.Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-ink">{obj}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
                <div className="flex items-center gap-2 text-sm text-ink-light">
                  <Icons.Clock className="w-4 h-4 text-primary" />
                  <span>{lesson.estimatedTime || "3 min"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-light">
                  <Icons.Star className="w-4 h-4 text-accent fill-accent" />
                  <span>+{lesson.xpReward || 30} XP on completion</span>
                </div>
                <Button className="ml-auto" onClick={() => next("understand")}>
                  Start Lesson <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── STEP 2: UNDERSTAND ────────────────────────────────────────── */}
        {currentStage === "understand" && steps?.understand && (
          <motion.div key="understand" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {/* Key Idea card */}
            {steps.understand.concept && (
              <div className="bg-primary-50 border border-primary/15 rounded-2xl p-5 mb-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
                  <Icons.Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Key Idea</div>
                  <p className="text-ink font-semibold leading-relaxed">{steps.understand.concept}</p>
                </div>
              </div>
            )}

            {/* Concept points */}
            {steps.understand.points?.length > 0 && (
              <div className="space-y-3 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-faint mb-3">
                  {steps.understand.points.length} Things To Know
                </h3>
                {steps.understand.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white border border-slate-100 rounded-xl p-5 shadow-softer hover:shadow-soft transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-extrabold text-primary">{i + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-ink mb-1.5">{point.title}</h4>
                        <p className="text-sm text-ink-light leading-relaxed">{point.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Legacy text fallback */}
            {!steps.understand.points?.length && steps.understand.text && (
              <Card className="p-6 mb-6">
                <p className="text-ink-light leading-relaxed">{steps.understand.text}</p>
              </Card>
            )}

            <Button className="w-full" onClick={() => next("seeIt")}>
              Continue <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </motion.div>
        )}

        {/* ── STEP 3: SEE IT ────────────────────────────────────────────── */}
        {(currentStage === "seeIt" || currentStage === "reveal") && steps?.seeIt && (
          <motion.div key="seeIt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-ink">See a Real-World Example</h3>
              <p className="text-sm text-ink-light mt-1">Look at the message below. Can you spot what's wrong?</p>
            </div>

            {/* Message preview */}
            <Card className="p-0 overflow-hidden mb-6 border-slate-200 shadow-sm">
              {/* Message header bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Icons.MessageCircle className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">Message from</div>
                  <div className="text-sm font-semibold text-ink-light">{steps.seeIt.sender}</div>
                </div>
              </div>
              <div className="p-5 bg-white">
                <HighlightableText
                  text={steps.seeIt.example}
                  redFlags={steps.seeIt.redFlags}
                  revealAll={currentStage === "reveal"}
                />
              </div>
            </Card>

            {currentStage === "seeIt" ? (
              <Button
                variant="outline"
                className="w-full border-2 border-danger text-danger hover:bg-danger-50"
                onClick={() => next("reveal")}
              >
                <Icons.AlertTriangle className="w-4 h-4 mr-2" /> Show Red Flags
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-danger mb-3">Red Flags Explained</h4>
                <div className="space-y-3 mb-6">
                  {steps.seeIt.redFlags.map((flag, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-white border border-danger-100 rounded-xl p-4 flex gap-3 shadow-softer"
                    >
                      <div className="w-6 h-6 bg-danger-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icons.AlertCircle className="w-3.5 h-3.5 text-danger" />
                      </div>
                      <div>
                        <span className="block font-bold text-ink text-sm mb-1">"{flag.text}"</span>
                        <span className="text-xs text-ink-light leading-relaxed">{flag.reason}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full" onClick={() => next("tryItYourself")}>
                  Now Try It Yourself <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── STEP 4: TRY IT YOURSELF ───────────────────────────────────── */}
        {currentStage === "tryItYourself" && steps?.tryItYourself && (
          <motion.div key="tryItYourself" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-ink">Now Try It Yourself</h3>
              <p className="text-sm text-ink-light mt-1">Tap every suspicious part in the message below.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-0 overflow-hidden">
              <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Icons.MessageCircle className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">Message from</div>
                  <div className="text-sm font-semibold text-ink-light">{steps.tryItYourself.sender}</div>
                </div>
              </div>
              <div className="p-5">
                <FindRedFlagsActivity
                  item={{ content: steps.tryItYourself.example, redFlags: steps.tryItYourself.redFlags }}
                  onComplete={() => setTimeout(() => next("realWorld"), 1800)}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 5: REAL WORLD ────────────────────────────────────────── */}
        {currentStage === "realWorld" && steps?.realWorld && (
          <motion.div key="realWorld" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-ink">Real-World Scenario</h3>
              <p className="text-sm text-ink-light mt-1">Read the situation carefully and choose the best response.</p>
            </div>

            <Card className="p-5 mb-6 bg-amber-50 border-amber-200">
              <div className="flex gap-3 items-start">
                <Icons.MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-ink font-medium text-sm leading-relaxed">{steps.realWorld.scenario}</p>
              </div>
            </Card>

            <h4 className="font-bold text-ink mb-4 text-sm">What should you do?</h4>
            <div className="space-y-3">
              {steps.realWorld.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { if (!realWorldSelection) setRealWorldSelection(opt); }}
                  disabled={!!realWorldSelection}
                  className={`w-full text-left p-4 rounded-xl font-medium text-sm flex justify-between items-start transition-all ${
                    realWorldSelection?.id === opt.id
                      ? opt.correct
                        ? "bg-success-50 text-success-800 border-2 border-success shadow-sm"
                        : "bg-danger-50 text-danger-800 border-2 border-danger shadow-sm"
                      : realWorldSelection && opt.correct
                        ? "bg-success-50 text-success-800 border-2 border-success opacity-60"
                        : "bg-white text-ink border-2 border-slate-200 hover:border-primary hover:-translate-y-0.5"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                      realWorldSelection?.id === opt.id
                        ? opt.correct ? "border-success bg-success text-white" : "border-danger bg-danger text-white"
                        : "border-current"
                    }`}>
                      {opt.id.toUpperCase()}
                    </span>
                    <span>{opt.text}</span>
                  </span>
                  {realWorldSelection?.id === opt.id && (
                    opt.correct
                      ? <Icons.CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      : <Icons.XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {realWorldSelection && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                  <div className={`p-4 rounded-xl flex gap-3 items-start mb-4 ${
                    realWorldSelection.correct
                      ? "bg-success-50 border border-success-200 text-success-900"
                      : "bg-danger-50 border border-danger-200 text-danger-900"
                  }`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {realWorldSelection.correct
                        ? <Icons.CheckCircle2 className="w-5 h-5 text-success" />
                        : <Icons.XCircle className="w-5 h-5 text-danger" />
                      }
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{realWorldSelection.feedback}</p>
                  </div>
                  <Button className="w-full" onClick={() => next("quiz")}>
                    Continue to Quiz <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── STEP 6: QUIZ ──────────────────────────────────────────────── */}
        {currentStage === "quiz" && steps?.quiz && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-ink">Quick Knowledge Check</h3>
              <p className="text-sm text-ink-light mt-1">Test what you've just learned.</p>
            </div>
            <Card className="p-6">
              <MiniQuizActivity quiz={steps.quiz} onComplete={() => next("takeaway")} />
            </Card>
          </motion.div>
        )}

        {/* ── STEP 7: TAKEAWAY ──────────────────────────────────────────── */}
        {currentStage === "takeaway" && steps?.takeaway && (
          <motion.div key="takeaway" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-ink">Key Takeaways</h3>
              <p className="text-sm text-ink-light mt-1">Remember these points from this lesson.</p>
            </div>

            {/* Title + summary callout */}
            <div className="bg-primary rounded-2xl p-6 text-white mb-6 shadow-lg shadow-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Icons.ShieldCheck className="w-6 h-6 text-white/80" />
                <h4 className="font-extrabold text-lg">{steps.takeaway.title}</h4>
              </div>
              {steps.takeaway.summary && (
                <p className="text-sm text-white/80 font-medium italic">"{steps.takeaway.summary}"</p>
              )}
            </div>

            {/* Takeaway points */}
            <div className="space-y-3 mb-8">
              {steps.takeaway.points.map((pt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 shadow-softer"
                >
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icons.CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="block font-bold text-ink mb-1">{pt.title}</span>
                    <span className="text-sm text-ink-light leading-relaxed">{pt.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="w-full" size="lg" onClick={finishLesson}>
              Complete Lesson <Icons.CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* ── STEP 8: COMPLETED ─────────────────────────────────────────── */}
        {currentStage === "completed" && (
          <motion.div key="completed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center py-10">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-24 h-24 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-success/30"
              >
                <Icons.CheckCircle className="w-12 h-12" />
              </motion.div>

              <h2 className="text-3xl font-extrabold text-ink mb-2">Lesson Complete!</h2>
              <p className="text-ink-light mb-8">{lesson.title}</p>

              {/* XP reward */}
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-accent-50 border border-accent-200 px-5 py-3 rounded-xl font-bold text-accent-700 flex items-center gap-2">
                  <Icons.Star className="w-5 h-5 fill-accent-400 text-accent-400" />
                  +{lesson.xpReward || 30} XP Earned
                </div>
              </div>

              {/* What you learned */}
              {objectives.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 max-w-sm mx-auto">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint mb-4">You Learned</h4>
                  <div className="space-y-2">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icons.CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-ink">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={onBack} size="lg" className="shadow-lg shadow-primary/20">
                Continue Learning <Icons.ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
