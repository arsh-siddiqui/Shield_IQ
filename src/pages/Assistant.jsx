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
  content: "Hello! I am your ShieldIQ Cybersecurity Assistant. Ask me anything about phishing emails, UPI fraud, suspicious links, malware, or how to understand your scan results.",
  timestamp: new Date().toISOString(),
};

export default function Assistant() {
  const location = useLocation();
  const { toast } = useToast();
  const chatEndRef = useRef(null);

  // Read initial scanContext from router location state (if navigated from ScanResult)
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

    // Format previous messages for API history
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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-extrabold text-ink">ShieldIQ Assistant</h1>
            </div>
            <p className="text-sm text-ink-light">
              Ask anything about cybersecurity, scams, phishing, and online safety.
            </p>
          </div>

          {messages.length > 1 && (
            <Button variant="ghost" size="sm" onClick={handleClearChat} icon={Trash2}>
              Clear Chat
            </Button>
          )}
        </div>

        {/* Scan Context Pill */}
        {scanContext && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-primary-50 border border-primary/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2 font-medium text-primary-900 min-w-0">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-bold">Active Scan Context:</span>
              <span className="truncate">
                {scanContext.target || scanContext.content || "Scan Result"} ({scanContext.riskLevel || "Analyzed"} Risk)
              </span>
            </div>
            <button
              onClick={() => {
                setScanContext(null);
                toast("Scan context cleared.", "info");
              }}
              className="text-ink-faint hover:text-danger flex items-center gap-1 font-semibold transition-colors flex-shrink-0"
            >
              <XCircle className="w-4 h-4" /> Clear Context
            </button>
          </motion.div>
        )}

        {/* Main Chat Box */}
        <Card className="flex-1 p-4 sm:p-6 flex flex-col min-h-0 border-slate-200 shadow-lift">
          
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
            {messages.map((msg, index) => (
              <AssistantMessage key={index} message={msg} />
            ))}

            {loading && <TypingIndicator />}

            {/* Suggested questions for brand new chat */}
            {messages.length === 1 && !loading && (
              <SuggestedQuestions onSelect={(q) => handleSend(q)} />
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="pt-4 border-t border-slate-100 mt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about phishing, scams, URL safety, or your scan result..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary focus:bg-white transition-all disabled:opacity-60"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                icon={Send}
                className="flex-shrink-0 shadow-md shadow-primary/20"
              >
                Send
              </Button>
            </form>
            <div className="flex items-center gap-1 text-[11px] text-ink-faint mt-2 justify-center">
              <Info className="w-3 h-3" />
              ShieldIQ Assistant provides defensive guidance based on safety best practices.
            </div>
          </div>

        </Card>

      </div>
    </AppLayout>
  );
}
