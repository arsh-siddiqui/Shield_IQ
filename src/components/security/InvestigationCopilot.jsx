import { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertCircle, Search, HelpCircle, Loader2 } from 'lucide-react';
import * as copilotService from '../../services/copilotService';

const SUGGESTED_QUESTIONS = [
  "Why is this email considered risky?",
  "What authentication failures were found?",
  "Which indicators deserve attention?",
  "What does the routing chain show?",
  "Summarize this investigation."
];

export default function InvestigationCopilot({ investigationId, onCitationClick }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (questionText) => {
    if (!questionText.trim()) return;

    const newMessages = [...messages, { role: 'user', content: questionText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await copilotService.askInvestigationCopilot(investigationId, questionText);
      if (response.success) {
        setMessages([...newMessages, { role: 'assistant', data: response.data }]);
      } else {
        setMessages([...newMessages, { role: 'error', content: 'Copilot unavailable.' }]);
      }
    } catch (err) {
      setMessages([...newMessages, { 
        role: 'error', 
        content: err.response?.data?.error?.message || 'Failed to communicate with Copilot.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderEvidenceCitations = (ids) => {
    if (!ids || ids.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {ids.map(id => (
          <button
            key={id}
            onClick={() => onCitationClick && onCitationClick(id)}
            className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 hover:bg-purple-500/40 transition-colors"
          >
            [{id}]
          </button>
        ))}
      </div>
    );
  };

  const renderAssistantMessage = (data) => {
    return (
      <div className="space-y-4 text-sm text-slate-300">
        {data.summary && <p className="leading-relaxed">{data.summary}</p>}
        {data.overallAssessment && <p className="leading-relaxed">{data.overallAssessment}</p>}

        {data.keyFindings?.length > 0 && (
          <div className="bg-secondary/50 p-3 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Key Findings</h4>
            <ul className="space-y-3">
              {data.keyFindings.map((kf, i) => (
                <li key={i}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      kf.severity === 'critical' ? 'bg-danger/20 text-danger' :
                      kf.severity === 'high' ? 'bg-warning/20 text-warning' :
                      kf.severity === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-accent-blue/20 text-accent-blue'
                    }`}>
                      {kf.severity}
                    </span>
                    <span className="font-medium text-primary">{kf.title}</span>
                  </div>
                  <p className="text-muted mt-1">{kf.description}</p>
                  {renderEvidenceCitations(kf.evidenceIds)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.uncertainties?.length > 0 && (
          <div className="bg-warning/5 p-3 rounded-lg border border-warning/20">
            <h4 className="font-semibold text-warning mb-2 flex items-center gap-1">
              <HelpCircle size={14} /> Missing Evidence
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {data.uncertainties.map((u, i) => (
                <li key={i} className="text-warning">{u}</li>
              ))}
            </ul>
          </div>
        )}

        {data.recommendedActions?.length > 0 && (
          <div className="bg-accent-blue/5 p-3 rounded-lg border border-accent-blue/20">
            <h4 className="font-semibold text-accent-blue mb-2">Recommended Actions</h4>
            <ul className="space-y-3">
              {data.recommendedActions.map((ra, i) => (
                <li key={i}>
                  <p className="font-medium text-primary">{ra.action}</p>
                  <p className="text-muted text-xs mt-0.5">{ra.reason}</p>
                  {renderEvidenceCitations(ra.evidenceIds)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-secondary/80 p-4 border-b border-border/50 flex items-center gap-3">
        <div className="p-2 bg-accent-violet/20 rounded-lg">
          <Bot className="text-accent-violet" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-primary">Investigation Copilot</h3>
          <p className="text-xs text-muted">Grounded by DetectIQ Evidence</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-accent-violet/10 flex items-center justify-center">
              <Search className="text-accent-violet/50" size={32} />
            </div>
            <div>
              <p className="text-secondary font-medium mb-1">How can I help with this investigation?</p>
              <p className="text-sm text-muted">I can analyze headers, indicators, and routing.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-secondary text-secondary px-3 py-1.5 rounded-full border border-border hover:bg-interactive hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent-violet/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-accent-violet" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-accent-violet text-white rounded-tr-sm' 
                  : msg.role === 'error'
                  ? 'bg-danger/10 border border-danger/20 text-danger rounded-tl-sm'
                  : 'bg-secondary border border-border text-primary rounded-tl-sm shadow-sm'
              }`}>
                {msg.role === 'user' ? msg.content : msg.role === 'error' ? (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm">{msg.content}</span>
                  </div>
                ) : renderAssistantMessage(msg.data)}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-accent-violet/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-accent-violet" />
            </div>
            <div className="bg-secondary border border-border rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-accent-violet" />
              <span className="text-sm text-muted">Analyzing evidence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-secondary/50 border-t border-border/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a question about this investigation..."
            className="flex-1 bg-background border border-border rounded-lg pl-4 pr-12 py-3 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-md w-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-accent-violet"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
