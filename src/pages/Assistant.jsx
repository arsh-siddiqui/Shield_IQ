import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ShieldCheck, Trash2, Sparkles, XCircle, Info } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AssistantMessage from "../components/assistant/AssistantMessage";
import SuggestedQuestions from "../components/assistant/SuggestedQuestions";
import TypingIndicator from "../components/assistant/TypingIndicator";
import { askAssistantRemote } from "../services/assistantService";
import { useToast } from "../context/ToastContext";

const INITIAL_WELCOME = {
  role: "assistant",
  content: "Hello! I am your DetectIQ Cybersecurity Assistant. Ask me anything about phishing emails, UPI fraud, suspicious links, malware, or how to understand your scan results.",
  timestamp: new Date().toISOString(),
};

export default function Assistant() {
  const location = useLocation();
  const { toast } = useToast();
  const chatEndRef = useRef(null);

  const [scanContext, setScanContext] = useState(location.state?.scanContext || null);
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initialPromptProcessed = useRef(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (location.state?.initialPrompt && !initialPromptProcessed.current) {
      initialPromptProcessed.current = true;
      handleSend(location.state.initialPrompt);
    }
  }, [location.state]);

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await askAssistantRemote({
      message: textToSend,
      conversationHistory: history,
      scanContext: scanContext,
    });

    setLoading(false);

    if (response.fallback) {
      toast("Assistant is temporarily unavailable.", "warning");
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response.message,
        model: response.model,
        timestamp: response.timestamp || new Date().toISOString(),
        fallback: response.fallback,
      },
    ]);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME]);
    toast("Chat history cleared.", "info");
  };

  const hasOnlyWelcome = messages.length === 1;

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] relative overflow-hidden bg-background">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin relative z-10">
          
          {/* Empty State / Welcome Screen */}
          {hasOnlyWelcome && !loading && (
            <div className="flex flex-col items-center justify-center min-h-full p-6 pb-32">
              <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-accent-blue/20 blur-[60px] rounded-full w-40 h-40 mx-auto transition-all duration-700 group-hover:bg-accent-blue/30 group-hover:scale-110" />
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#0B1120] to-[#111827] border border-accent-blue/30 shadow-elevated flex items-center justify-center relative z-10 mx-auto">
                  <Sparkles className="w-10 h-10 text-accent-blue" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight">
                DetectIQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-violet">Assistant</span>
              </h1>
              <p className="text-secondary font-medium text-lg max-w-lg text-center mb-12">
                Your AI-powered cybersecurity expert. Ask about phishing, scams, online safety, or get help analyzing your scan results.
              </p>
              
              <div className="w-full max-w-2xl px-4">
                <SuggestedQuestions onSelect={(q) => handleSend(q)} />
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-40">
            {/* Context Pill (if active and conversation started) */}
            {scanContext && !hasOnlyWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-fit bg-primary/5 border border-primary/10 rounded-full px-5 py-2.5 flex items-center justify-center gap-3 text-xs mb-8 backdrop-blur-sm shadow-sm"
              >
                <div className="flex items-center gap-2 font-medium text-primary">
                  <Sparkles className="w-4 h-4 text-accent-blue flex-shrink-0" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">Active Context:</span>
                  <span className="truncate max-w-[200px] sm:max-w-[300px]">
                    {scanContext.target || scanContext.content || "Scan Result"}
                  </span>
                </div>
                <div className="w-px h-4 bg-border mx-1"></div>
                <button
                  onClick={() => {
                    setScanContext(null);
                    toast("Scan context cleared.", "info");
                  }}
                  className="text-secondary hover:text-danger flex items-center gap-1 font-semibold transition-colors flex-shrink-0 uppercase tracking-wider text-[10px]"
                >
                  <XCircle className="w-3 h-3" /> Clear
                </button>
              </motion.div>
            )}

            {!hasOnlyWelcome && messages.map((msg, index) => {
              if (index === 0) return null; // Skip welcome message in chat view
              return <AssistantMessage key={index} message={msg} />;
            })}

            {loading && !hasOnlyWelcome && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Dock */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-20 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden transition-all focus-within:border-accent-blue/50 focus-within:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] relative group">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-end gap-2 p-3 sm:p-4"
              >
                <textarea
                  rows="1"
                  placeholder="Ask a security question..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={loading}
                  className="flex-1 max-h-[120px] bg-transparent resize-none border-none px-2 py-1.5 text-base text-primary placeholder:text-muted focus:outline-none focus:ring-0 scrollbar-thin transition-all disabled:opacity-60"
                  style={{ minHeight: '44px' }}
                />
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {messages.length > 1 && (
                    <button 
                      type="button"
                      onClick={handleClearChat}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                      title="Clear Chat"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-accent-blue text-white flex items-center justify-center disabled:opacity-50 disabled:bg-muted shadow-soft transition-all hover:bg-accent-blue/90"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
            <div className="text-center mt-3 text-[11px] font-medium text-muted">
              DetectIQ Assistant can make mistakes. Consider verifying critical security advice.
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
