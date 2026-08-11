import { motion } from "framer-motion";
import { ShieldCheck, User, AlertCircle } from "lucide-react";

export default function AssistantMessage({ message }) {
  const isUser = message.role === "user";
  const isFallback = message.fallback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 my-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 shadow-sm ${
          isUser
            ? "bg-primary-600 text-white"
            : isFallback
            ? "bg-amber-500 text-white"
            : "bg-primary text-white"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : isFallback ? <AlertCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-tr-none shadow-soft"
            : isFallback
            ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none"
            : "bg-white border border-slate-200 text-ink rounded-tl-none shadow-softer"
        }`}
      >
        {!isUser && (
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-faint mb-1 flex items-center gap-1.5">
            <span>ShieldIQ Assistant</span>
            {message.model && <span className="text-[10px] font-mono text-slate-400">({message.model})</span>}
          </div>
        )}
        <div className="whitespace-pre-wrap font-sans leading-relaxed">{message.content}</div>
        {message.timestamp && (
          <div className={`text-[10px] mt-2 text-right ${isUser ? "text-white/70" : "text-ink-faint"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
