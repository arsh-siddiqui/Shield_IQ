import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { useAppData } from "../../context/AppDataContext";
import FindRedFlagsActivity from "./FindRedFlagsActivity";
import MiniQuizActivity from "./MiniQuizActivity";

function HighlightableText({ text, redFlags, revealAll }) {
  const contentSegments = useMemo(() => {
    let segments = [];
    let lastIndex = 0;
    
    // Safety check in case redFlags isn't provided correctly
    if (!redFlags || redFlags.length === 0) {
      return [{ isFlag: false, text }];
    }
    
    const flagsWithPos = redFlags.map((flag, idx) => {
      return { ...flag, idx, pos: text.indexOf(flag.text) };
    }).filter(f => f.pos !== -1).sort((a, b) => a.pos - b.pos);

    flagsWithPos.forEach(flag => {
      if (flag.pos > lastIndex) {
        segments.push({ isFlag: false, text: text.slice(lastIndex, flag.pos) });
      }
      segments.push({ isFlag: true, text: flag.text, idx: flag.idx, reason: flag.reason });
      lastIndex = flag.pos + flag.text.length;
    });

    if (lastIndex < text.length) {
      segments.push({ isFlag: false, text: text.slice(lastIndex) });
    }

    return segments;
  }, [text, redFlags]);

  return (
    <p className="text-sm leading-loose">
      {contentSegments.map((seg, i) => {
        if (!seg.isFlag) {
          return <span key={i} className="text-ink whitespace-pre-wrap">{seg.text}</span>;
        }

        return (
          <span
            key={i}
            className={`relative px-1 mx-0.5 rounded transition-all duration-500 ${
              revealAll 
                ? 'bg-danger-100 text-danger-900 font-bold border-b-2 border-danger' 
                : 'text-ink'
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

export default function ActiveLesson({ lesson, steps, onBack }) {
  const { completeLesson, updateSkill } = useAppData();
  // Flow: understand -> seeIt -> reveal -> tryItYourself -> realWorld -> quiz -> takeaway -> completed
  const [currentStage, setCurrentStage] = useState("understand");
  
  // Real world state
  const [realWorldFeedback, setRealWorldFeedback] = useState(null);

  const finishLesson = (score) => {
    completeLesson(lesson.id, 30 + (score * 10 || 0));
    updateSkill("Phishing Detection", 10);
    setCurrentStage("completed");
  };

  const nextStage = (stage) => setCurrentStage(stage);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button onClick={onBack} className="text-sm font-semibold text-ink-light flex items-center gap-1 mb-6 hover:text-primary transition-colors">
        <Icons.ArrowLeft className="w-4 h-4" /> Back to Learn
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-ink">{lesson.title}</h2>
        <p className="text-ink-light mt-1">{lesson.description}</p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: UNDERSTAND */}
        {currentStage === "understand" && steps.understand && (
          <motion.div key="understand" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8 mb-6">
              <h3 className="text-xl font-bold text-ink mb-4">{steps.understand.title}</h3>
              <p className="text-lg text-ink-light font-medium leading-relaxed mb-6">
                {steps.understand.text}
              </p>
              <Button onClick={() => nextStage("seeIt")} className="w-full">Continue</Button>
            </Card>
          </motion.div>
        )}

        {/* STEP 2 & 3: SEE IT & REVEAL */}
        {(currentStage === "seeIt" || currentStage === "reveal") && steps.seeIt && (
          <motion.div key="seeIt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h3 className="text-xl font-bold text-ink mb-4">See a realistic example</h3>
            <Card className="p-6 mb-6 bg-slate-50 border-slate-100 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <Icons.Smartphone className="w-5 h-5 text-ink-light" />
                <span className="text-sm font-semibold text-ink-light">New Message from {steps.seeIt.sender}</span>
              </div>
              <HighlightableText 
                text={steps.seeIt.example} 
                redFlags={steps.seeIt.redFlags} 
                revealAll={currentStage === "reveal"} 
              />
            </Card>

            {currentStage === "seeIt" ? (
              <Button onClick={() => nextStage("reveal")} variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary-50">Show Red Flags</Button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                <div className="space-y-2 mb-6">
                  {steps.seeIt.redFlags.map((flag, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} key={i} className="p-3 bg-white border border-slate-100 rounded-lg text-sm flex gap-3 shadow-sm">
                      <div className="w-1.5 rounded-full bg-danger flex-shrink-0" />
                      <div>
                        <span className="font-bold text-ink block mb-1">"{flag.text}"</span>
                        <span className="text-ink-light text-xs">{flag.reason}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button onClick={() => nextStage("tryItYourself")} className="w-full">Next</Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 4: TRY IT YOURSELF */}
        {currentStage === "tryItYourself" && steps.tryItYourself && (
          <motion.div key="tryItYourself" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icons.Smartphone className="w-5 h-5 text-ink-light" />
                <span className="text-sm font-semibold text-ink-light">New Message from {steps.tryItYourself.sender}</span>
              </div>
              <FindRedFlagsActivity 
                item={{ content: steps.tryItYourself.example, redFlags: steps.tryItYourself.redFlags }} 
                onComplete={() => setTimeout(() => nextStage("realWorld"), 1500)} 
              />
            </Card>
          </motion.div>
        )}

        {/* STEP 5: REAL WORLD EXAMPLE */}
        {currentStage === "realWorld" && steps.realWorld && (
          <motion.div key="realWorld" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h3 className="text-xl font-bold text-ink mb-4">Real-World Scenario</h3>
            <Card className="p-6 mb-6 bg-slate-50 border-slate-100 shadow-inner">
              <p className="text-lg text-ink font-medium leading-relaxed">{steps.realWorld.scenario}</p>
            </Card>
            
            <h4 className="font-bold text-ink mb-4">What should you do?</h4>
            <div className="space-y-3">
              {steps.realWorld.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (!realWorldFeedback) setRealWorldFeedback(opt);
                  }}
                  disabled={!!realWorldFeedback}
                  className={`w-full text-left p-4 rounded-xl font-medium flex justify-between items-center transition-all ${
                    realWorldFeedback?.id === opt.id
                      ? opt.correct ? 'bg-success-50 text-success-800 border border-success' : 'bg-danger-50 text-danger-800 border border-danger'
                      : 'bg-white text-ink border border-slate-200 hover:border-primary'
                  }`}
                >
                  {opt.text}
                  {realWorldFeedback?.id === opt.id && (
                    opt.correct ? <Icons.CheckCircle2 className="w-5 h-5 text-success" /> : <Icons.XCircle className="w-5 h-5 text-danger" />
                  )}
                </button>
              ))}
            </div>

            {realWorldFeedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-xl flex gap-3 items-start ${realWorldFeedback.correct ? 'bg-success-50 text-success-900' : 'bg-danger-50 text-danger-900'}`}>
                <Icons.Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">{realWorldFeedback.feedback}</p>
              </motion.div>
            )}

            {realWorldFeedback && (
              <Button onClick={() => nextStage("quiz")} className="w-full mt-6">Continue</Button>
            )}
          </motion.div>
        )}

        {/* STEP 6: QUIZ */}
        {currentStage === "quiz" && steps.quiz && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-6">
              <MiniQuizActivity quiz={steps.quiz} onComplete={() => nextStage("takeaway")} />
            </Card>
          </motion.div>
        )}

        {/* STEP 7: TAKEAWAY */}
        {currentStage === "takeaway" && steps.takeaway && (
          <motion.div key="takeaway" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8 text-center bg-gradient-to-br from-primary-50 to-white">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-6">{steps.takeaway.title}</h3>
              <div className="space-y-4">
                {steps.takeaway.points.map((pt, i) => (
                  <div key={i} className="text-left bg-white p-4 rounded-lg shadow-sm">
                    <span className="block font-bold text-primary mb-1">{pt.title}</span>
                    <span className="text-ink-light text-sm">{pt.text}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Button className="w-full mt-6" onClick={() => finishLesson(3)}>Complete Lesson</Button>
          </motion.div>
        )}

        {/* STEP 8: COMPLETED */}
        {currentStage === "completed" && (
          <motion.div key="completed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/30">
                <Icons.CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-extrabold text-ink mb-3">Lesson Complete!</h2>
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-slate-50 px-4 py-2 rounded-lg font-bold text-ink flex items-center gap-2">
                  <Icons.Star className="w-4 h-4 text-accent fill-accent" /> +30 XP
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-lg font-bold text-ink flex items-center gap-2">
                  <Icons.TrendingUp className="w-4 h-4 text-primary" /> Skill Progress
                </div>
              </div>
              <Button onClick={onBack} size="lg">Continue Learning</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
