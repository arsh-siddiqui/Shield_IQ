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
      className={`flex items-end gap-4 my-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
          isUser
            ? "bg-gradient-to-br from-accent-blue to-accent-violet text-white border-accent-blue/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            : isFallback
            ? "bg-warning/20 text-warning border-warning/30"
            : "bg-card text-accent-blue border-accent-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : isFallback ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 sm:p-6 text-sm leading-relaxed relative ${
          isUser
            ? "bg-accent-blue text-white rounded-br-none shadow-soft"
            : isFallback
            ? "bg-warning/10 border border-warning/20 text-warning rounded-bl-none"
            : "bg-card border border-border text-primary rounded-bl-none shadow-elevated"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-[10px] text-accent-blue tracking-wider uppercase">
              DetectIQ Assistant
            </span>
            {message.fallback && (
              <span className="bg-warning/10 text-warning text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-warning/20">
                Fallback
              </span>
            )}
          </div>
        )}
        <div className="font-medium text-base">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-xl font-extrabold mt-6 mb-3 text-primary" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-2 text-primary" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-4 mb-2 text-primary" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 last:mb-0 text-secondary leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-secondary" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-secondary" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                blockquote: ({ node, ...props }) => {
                  const text = props.children?.toString() || "";
                  let borderColor = "border-accent-blue/40";
                  let bgColor = "bg-accent-blue/5";
                  let textColor = "text-accent-blue";
                  
                  if (text.includes("Warning") || text.includes("Red Flag")) {
                    borderColor = "border-danger/40";
                    bgColor = "bg-danger/5";
                    textColor = "text-danger";
                  } else if (text.includes("Safe Action")) {
                    borderColor = "border-success/40";
                    bgColor = "bg-success/5";
                    textColor = "text-success";
                  }

                  return (
                    <blockquote 
                      className={`border-l-4 ${borderColor} ${bgColor} p-4 my-4 rounded-r-xl text-sm font-medium ${textColor}`} 
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
          <div className={`text-[10px] mt-4 font-bold text-right ${isUser ? "text-white/70" : "text-muted"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
