import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Card from "../ui/Card";
import { useToast } from "../../context/ToastContext";
import { useAppData } from "../../context/AppDataContext";

export default function FindRedFlagsActivity({ item, onComplete }) {
  const [foundFlags, setFoundFlags] = useState(() => new Set());
  const { updateSkill } = useAppData();
  const { toast } = useToast();

  const totalFlags = item.redFlags.length;
  const isComplete = foundFlags.size === totalFlags;

  const handleFlagClick = (flagIndex) => {
    if (foundFlags.has(flagIndex)) return;
    
    const newSet = new Set(foundFlags).add(flagIndex);
    setFoundFlags(newSet);
    
    if (newSet.size === totalFlags) {
      toast(`Awesome! All ${totalFlags} Red Flags Found!`, "success");
      updateSkill("Phishing Detection", 10);
      setTimeout(() => onComplete?.(true), 3000);
    }
  };

  const contentSegments = useMemo(() => {
    let text = item.content;
    let segments = [];
    let lastIndex = 0;

    // We assume red flags do not overlap and are exactly present in text.
    // For a real app, a proper tokenizer or strict substring matching logic is needed.
    // Here we do a simple find & slice.
    
    // Sort flags by position in text to correctly split
    const flagsWithPos = item.redFlags.map((flag, idx) => {
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
  }, [item.content, item.redFlags]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-ink">Tap everything suspicious</h4>
        <div className="bg-primary-50 text-primary px-3 py-1 rounded-full text-xs font-bold">
          {foundFlags.size} / {totalFlags} Found
        </div>
      </div>

      <Card className="p-6 mb-6 bg-slate-50 border-slate-100 shadow-inner">
        <p className="text-sm leading-loose">
          {contentSegments.map((seg, i) => {
            if (!seg.isFlag) {
              return <span key={i} className="text-ink whitespace-pre-wrap">{seg.text}</span>;
            }

            const isRevealed = foundFlags.has(seg.idx);

            return (
              <button
                key={i}
                onClick={() => handleFlagClick(seg.idx)}
                disabled={isRevealed}
                className={`relative px-1 mx-0.5 rounded transition-all duration-200 ${
                  isRevealed 
                    ? 'bg-danger-100 text-danger-800 font-bold border-b-2 border-danger' 
                    : 'hover:bg-slate-200 hover:text-ink cursor-pointer border-b border-dashed border-slate-300'
                }`}
              >
                {seg.text}
                {isRevealed && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 -right-3 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-[10px]"
                  >
                    <Icons.AlertTriangle className="w-3 h-3" />
                  </motion.span>
                )}
              </button>
            );
          })}
        </p>
      </Card>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className="overflow-hidden space-y-3"
          >
            <div className="bg-success-50 p-4 rounded-xl text-sm text-success-800 font-bold flex items-center gap-2">
              <Icons.CheckCircle2 className="w-5 h-5" />
              You found all the red flags!
            </div>
            
            <div className="space-y-2">
              {item.redFlags.map((flag, i) => (
                <div key={i} className="p-3 bg-white border border-slate-100 rounded-lg text-sm flex gap-3 shadow-softer">
                  <div className="w-1.5 rounded-full bg-danger flex-shrink-0" />
                  <div>
                    <span className="font-bold text-ink block mb-1">"{flag.text}"</span>
                    <span className="text-ink-light text-xs">{flag.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
