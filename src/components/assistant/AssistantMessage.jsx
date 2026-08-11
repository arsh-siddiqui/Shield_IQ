import { motion } from "framer-motion";
import { ShieldCheck, User, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          </div>
        )}
        <div className="font-sans leading-relaxed text-[14px]">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2 text-slate-900" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-4 mb-2 text-slate-800" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-[15px] font-bold mt-3 mb-1 text-slate-800" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                blockquote: ({ node, ...props }) => {
                  const text = props.children?.toString() || "";
                  let borderColor = "border-primary/40";
                  let bgColor = "bg-primary-50/50";
                  
                  if (text.includes("Warning") || text.includes("Red Flag")) {
                    borderColor = "border-red-400";
                    bgColor = "bg-red-50/50";
                  } else if (text.includes("Safe Action")) {
                    borderColor = "border-green-400";
                    bgColor = "bg-green-50/50";
                  }

                  return (
                    <blockquote 
                      className={`border-l-4 ${borderColor} ${bgColor} p-3 my-3 rounded-r-lg text-[13px] text-slate-700`} 
                      {...props} 
                    />
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {message.timestamp && (
          <div className={`text-[10px] mt-2 text-right ${isUser ? "text-white/70" : "text-ink-faint"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
