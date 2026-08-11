import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 my-4">
      <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-softer flex items-center gap-1.5">
        <span className="text-xs text-ink-light font-semibold mr-1">ShieldIQ Assistant is thinking</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
