import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAppData } from "../../context/AppDataContext";
import { useToast } from "../../context/ToastContext";
import { newDailyChallenges } from "../../data/dummyData";

export default function DailyChallengeCard() {
  const { challengeCompletions, completeChallenge } = useAppData();
  const { toast } = useToast();
  
  // Find a challenge that isn't completed yet, or just show the first one if all done.
  const challenge = newDailyChallenges.find(c => !challengeCompletions.has(c.id)) || newDailyChallenges[0];
  const isCompleted = challengeCompletions.has(challenge.id);

  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(isCompleted);

  const handleSelect = (opt) => {
    if (isCompleted || showFeedback) return;
    setSelectedOption(opt.id);
    setShowFeedback(true);
    
    if (opt.correct) {
      completeChallenge(challenge.id, 10);
      toast("Correct! +10 XP", "success");
    } else {
      toast("Not quite, check the explanation.", "warning");
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-accent-50 to-white relative overflow-hidden">
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <span className="bg-success-100 text-success text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Icons.CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
          <Icons.Trophy className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-ink">Today's Challenge</h3>
          <p className="text-xs text-ink-light">Earn +10 XP</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 mb-5 shadow-softer">
        <p className="text-sm text-ink-light leading-relaxed italic border-l-2 border-accent-200 pl-3">
          "{challenge.message}"
        </p>
      </div>

      <h4 className="font-semibold text-ink text-sm mb-3">{challenge.question}</h4>
      
      <div className="space-y-2">
        {challenge.options.map(opt => {
          const isSelected = selectedOption === opt.id;
          const isCorrect = opt.correct;
          
          let btnClass = "border-slate-200 bg-white text-ink-light hover:border-primary/40";
          if (showFeedback) {
            if (isCorrect) btnClass = "border-success bg-success-50 text-ink";
            else if (isSelected && !isCorrect) btnClass = "border-danger bg-danger-50 text-ink";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={showFeedback || isCompleted}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all duration-200 ${btnClass} ${(showFeedback || isCompleted) ? 'cursor-default' : 'hover:scale-[1.01]'}`}
            >
              <div className="flex justify-between items-center">
                <span>{opt.text}</span>
                {showFeedback && isCorrect && <Icons.Check className="w-4 h-4 text-success" />}
                {showFeedback && isSelected && !isCorrect && <Icons.X className="w-4 h-4 text-danger" />}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl text-sm ${selectedOption && challenge.options.find(o => o.id === selectedOption)?.correct ? 'bg-success-50 text-success-800' : 'bg-slate-50 text-ink-light'}`}>
              <p><strong>Feedback:</strong> {challenge.feedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
