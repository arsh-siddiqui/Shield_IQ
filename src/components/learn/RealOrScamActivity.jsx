import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../context/ToastContext";
import { useAppData } from "../../context/AppDataContext";

export default function RealOrScamActivity({ item, onComplete }) {
  const [selected, setSelected] = useState(null);
  const { updateSkill } = useAppData();
  const { toast } = useToast();

  const handleSelect = (choice) => {
    if (selected) return;
    setSelected(choice);
    
    if (choice === item.correctAnswer) {
      toast("Correct! Well done.", "success");
      updateSkill("Scam Recognition", 5);
    } else {
      toast("Not quite. Review the explanation.", "warning");
    }
    
    setTimeout(() => {
      onComplete?.(choice === item.correctAnswer);
    }, 2000);
  };

  return (
    <div className="w-full">
      <Card className="p-5 mb-4 bg-slate-50 border-slate-100">
        <div className="flex items-center gap-2 mb-3 text-ink-light">
          <Icons.MessageSquare className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">{item.channel || "Message"}</span>
        </div>
        <p className="text-sm text-ink whitespace-pre-wrap">{item.content}</p>
      </Card>

      <h4 className="text-center font-bold text-ink mb-4">Is this Safe or a Scam?</h4>

      <div className="grid grid-cols-3 gap-3">
        {['SAFE', 'SCAM', 'NOT SURE'].map((choice) => {
          let btnClass = "border-slate-200 bg-white text-ink-light hover:border-primary/40";
          if (selected) {
            if (choice === item.correctAnswer) btnClass = "border-success bg-success-50 text-success-800";
            else if (choice === selected) btnClass = "border-danger bg-danger-50 text-danger-800";
            else btnClass = "opacity-50 border-slate-200 bg-white";
          }

          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              disabled={!!selected}
              className={`py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${btnClass} ${!selected && 'hover:scale-[1.02]'}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className="mt-6 overflow-hidden"
          >
            <div className={`p-4 rounded-xl text-sm ${selected === item.correctAnswer ? 'bg-success-50' : 'bg-danger-50'}`}>
              <h5 className={`font-bold mb-1 ${selected === item.correctAnswer ? 'text-success-800' : 'text-danger-800'}`}>
                {selected === item.correctAnswer ? "Correct!" : "Actually..."} It's a {item.correctAnswer}
              </h5>
              <p className="text-ink-light leading-relaxed">{item.explanation}</p>
              
              {item.indicators && (
                <div className="mt-3 space-y-1">
                  <span className="text-xs font-bold text-ink uppercase">Indicators:</span>
                  <ul className="list-disc list-inside text-ink-light text-xs">
                    {item.indicators.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
