import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function MiniQuizActivity({ quiz, onComplete }) {
  // If quiz is just an object, wrap it in array. But let's assume it's passed as single question for now
  // or array of questions.
  const questions = Array.isArray(quiz) ? quiz : [quiz];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  
  const question = questions[currentIdx];
  const isFinished = currentIdx >= questions.length;

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelected(opt.id);
    setShowFeedback(true);
    if (opt.correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowFeedback(false);
    setCurrentIdx(c => c + 1);
  };

  if (isFinished) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success-100 text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">Quiz Complete!</h3>
        <p className="text-ink-light mb-6">You scored {score} out of {questions.length}</p>
        <Button onClick={() => onComplete?.(score)}>Continue Learning</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-ink">Quick Check</h4>
        <span className="text-xs font-semibold text-ink-light bg-slate-100 px-2 py-1 rounded-full">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <h5 className="text-lg font-semibold text-ink mb-6">{question.question}</h5>

      <div className="space-y-3 mb-6">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.correct;
          
          let btnClass = "border-slate-200 bg-white text-ink-light hover:border-primary/40";
          if (showFeedback) {
            if (isCorrect) btnClass = "border-success bg-success-50 text-success-800";
            else if (isSelected && !isCorrect) btnClass = "border-danger bg-danger-50 text-danger-800";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center justify-between ${btnClass} ${!showFeedback && 'hover:-translate-y-0.5'}`}
            >
              <span>{opt.text}</span>
              {showFeedback && isCorrect && <Icons.CheckCircle2 className="w-5 h-5 text-success" />}
              {showFeedback && isSelected && !isCorrect && <Icons.XCircle className="w-5 h-5 text-danger" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <Button onClick={nextQuestion} className="flex items-center gap-2">
              Next <Icons.ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
