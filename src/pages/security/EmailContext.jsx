import { useState, useEffect } from "react";
import { FileSearch, Trash2, ShieldCheck, Loader2, Plus, AlertCircle } from "lucide-react";
import { getEmailHistory, deleteEmailHistory, addEmailHistory } from "../../services/emailHistoryService";
import Button from "../../components/ui/Button";

export default function EmailContext() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  async function loadEmails() {
    try {
      setLoading(true);
      const data = await getEmailHistory();
      setEmails(data || []);
    } catch (err) {
      setError("Failed to load historical emails.");
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAdding(true);
    try {
      await addEmailHistory({
        subject: "User Context Email",
        body: newEmail,
        isLegitimate: true
      });
      setNewEmail("");
      loadEmails();
    } catch (err) {
      setError("Failed to add email context.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmailHistory(id);
      loadEmails();
    } catch (err) {
      setError("Failed to delete email context.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          <FileSearch className="w-8 h-8 text-primary" />
          Email Context
        </h1>
        <p className="text-ink-light mt-2">
          Manage your historical legitimate emails. DetectIQ uses this securely as context for RAG-based personalized phishing detection.
        </p>
      </header>

      {error && (
        <div className="bg-danger-50 text-danger p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Add new email context form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <label className="text-sm font-bold text-ink">Add Legitimate Email Context</label>
        <textarea
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          disabled={adding}
          placeholder="Paste the body of a known safe email..."
          className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-50 transition-all resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={adding || !newEmail.trim()}>
            {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Add Email
          </Button>
        </div>
      </form>

      {/* List of context emails */}
      {loading ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink">No historical emails</h3>
          <p className="text-sm text-ink-light mt-1">Add some legitimate emails to improve personalization.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-ink">Your Historical Emails ({emails.length})</h3>
          {emails.map((email) => (
            <div key={email._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink mb-1 truncate">{email.subject}</div>
                <div className="text-xs text-ink-light truncate max-w-[500px]">
                  {email.body.substring(0, 150)}...
                </div>
                <div className="text-[10px] font-bold text-ink-faint mt-2 uppercase tracking-wider">
                  Indexed: {new Date(email.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(email._id)}
                className="p-2 text-ink-faint hover:text-danger hover:bg-danger-50 rounded-lg transition-colors flex-shrink-0"
                title="Delete Context"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
