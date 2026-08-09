import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Timeline from "../components/Timeline";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { attackReplaySteps } from "../data/dummyData";

export default function AttackReplay() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const index = attackReplaySteps.findIndex((s) => s.id === activeStep);
  const step = attackReplaySteps[index];
  const StepIcon = Icons[step.icon] || Icons.Circle;
  const isFirst = index === 0;
  const isLast = index === attackReplaySteps.length - 1;

  const goTo = (newIndex) => {
    setDirection(newIndex > index ? 1 : -1);
    setActiveStep(attackReplaySteps[newIndex].id);
  };

  return (
    <AppLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-ink-light hover:text-ink mb-6">
        <Icons.ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-extrabold text-ink">Attack Replay</h1>
        <p className="text-sm text-ink-light mt-1">
          See exactly how a real bank phishing scam unfolds, step by step — and how each step could have been
          stopped.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6 max-w-2xl">
        {attackReplaySteps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= index ? "bg-primary" : "bg-slate-200"}`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide card */}
      <Card className="p-8 max-w-2xl overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <StepIcon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-primary">Step {index + 1} of {attackReplaySteps.length}</div>
                <h3 className="font-extrabold text-ink text-lg">{step.title}</h3>
              </div>
            </div>
            <p className="text-sm text-ink-light leading-relaxed mb-5">{step.description}</p>
            <div className="bg-accent-50 rounded-xl p-4 flex items-start gap-3">
              <Icons.Lightbulb className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed">
                <span className="font-semibold">Safety tip: </span>
                {step.tip}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <Button variant="outline" icon={Icons.ArrowLeft} onClick={() => goTo(index - 1)} disabled={isFirst}>
            Previous
          </Button>
          {isLast ? (
            <Button icon={Icons.Gamepad2} onClick={() => navigate("/simulator")}>
              Practice This Scenario
            </Button>
          ) : (
            <Button icon={Icons.ArrowRight} iconPosition="right" onClick={() => goTo(index + 1)}>
              Next Step
            </Button>
          )}
        </div>
      </Card>

      {/* Full timeline overview */}
      <div className="mt-14 max-w-4xl">
        <h3 className="font-bold text-ink mb-6">Full Timeline</h3>
        <Timeline steps={attackReplaySteps} activeStep={activeStep} onStepClick={setActiveStep} />
      </div>

      <Card className="p-6 mt-10 max-w-2xl bg-primary-50/50">
        <div className="flex items-start gap-3">
          <Icons.ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ink-light leading-relaxed">
            Every step in this chain is a chance to stop the scam. Recognizing even one red flag could have
            prevented the loss entirely.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button icon={Icons.Gamepad2} onClick={() => navigate("/simulator")}>
            Practice Similar Scenarios
          </Button>
          <Button variant="outline" icon={Icons.BookOpen} onClick={() => navigate("/learn")}>
            Learn Warning Signs
          </Button>
        </div>
      </Card>
    </AppLayout>
  );
}
