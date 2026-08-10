import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Button from "../ui/Button";

export default function MiniQuizActivity({ quiz, onComplete }) {
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
    if (opt.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowFeedback(false);
    setCurrentIdx(c => c + 1);
  };

  // Completed state
  if (isFinished) {
    const allCorrect = score === questions.length;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${allCorrect ? "bg-success-100 text-success" : "bg-primary-100 text-primary"}`}>
          <Icons.Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-ink mb-1">Quiz Complete!</h3>
        <p className="text-ink-light mb-2">
          You scored <span className="font-bold text-ink">{score}</span> out of <span className="font-bold text-ink">{questions.length}</span>
        </p>
        {allCorrect && (
          <p className="text-sm text-success-700 font-medium mb-6">Perfect score — excellent work!</p>
        )}
        {!allCorrect && (
          <p className="text-sm text-ink-light mb-6">Every question is a learning step. Keep going!</p>
        )}
        <Button onClick={() => onComplete?.(score)}>
          Continue <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </motion.div>
    );
  }

  const selectedOpt = question.options.find(o => o.id === selected);
  const isCorrect = selectedOpt?.correct;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-ink text-sm">Question {currentIdx + 1}</h4>
        {questions.length > 1 && (
          <span className="text-xs font-semibold text-ink-light bg-slate-100 px-3 py-1 rounded-full">
            {currentIdx + 1} / {questions.length}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-base font-semibold text-ink mb-6 leading-relaxed">{question.question}</p>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrectOpt = opt.correct;

          let cls = "border-slate-200 bg-white text-ink hover:border-primary/50 hover:-translate-y-0.5";
          if (showFeedback) {
            if (isCorrectOpt) cls = "border-success bg-success-50 text-success-900";
            else if (isSelected && !isCorrectOpt) cls = "border-danger bg-danger-50 text-danger-900";
            else cls = "border-slate-100 bg-slate-50 text-ink-faint";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={!!showFeedback}
              className={`w-full text-left p-4 rounded-xl text-sm font-medium border-2 transition-all duration-200 flex items-center justify-between ${cls}`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                  showFeedback && isCorrectOpt ? "border-success bg-success text-white" :
                  showFeedback && isSelected && !isCorrectOpt ? "border-danger bg-danger text-white" :
                  "border-current"
                }`}>
                  {opt.id}
                </span>
                <span>{opt.text}</span>
              </span>
              {showFeedback && isCorrectOpt && <Icons.CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}
              {showFeedback && isSelected && !isCorrectOpt && <Icons.XCircle className="w-5 h-5 text-danger flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation and Next */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Result banner */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${
              isCorrect ? "bg-success-50 border border-success-200" : "bg-danger-50 border border-danger-200"
            }`}>
              <div className="flex-shrink-0 mt-0.5">
                {isCorrect
                  ? <Icons.CheckCircle2 className="w-5 h-5 text-success" />
                  : <Icons.XCircle className="w-5 h-5 text-danger" />
                }
              </div>
              <div>
                <p className={`font-bold text-sm mb-1 ${isCorrect ? "text-success-800" : "text-danger-800"}`}>
                  {isCorrect ? "Correct!" : "Not quite."}
                </p>
                {question.explanation && (
                  <p className={`text-xs leading-relaxed ${isCorrect ? "text-success-700" : "text-danger-700"}`}>
                    {question.explanation}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={nextQuestion} className="flex items-center gap-2">
                {currentIdx < questions.length - 1 ? "Next Question" : "See Results"}
                <Icons.ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
