import { HelpCircle } from "lucide-react";

const SUGGESTIONS = [
  "What is phishing?",
  "How can I identify a fake UPI request?",
  "What should I do after clicking a suspicious link?",
  "Why was my scan marked High Risk?",
];

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div className="my-6">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-faint mb-3">
        <HelpCircle className="w-3.5 h-3.5" />
        Suggested Questions
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {SUGGESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-primary/50 hover:bg-primary-50/50 text-xs font-semibold text-ink transition-all shadow-softer hover:shadow-soft"
          >
            "{q}"
          </button>
        ))}
      </div>
    </div>
  );
}
