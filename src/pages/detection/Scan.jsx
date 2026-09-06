import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Globe, ShieldAlert, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { submitScan } from "../../services/detectionService";

export default function Scan() {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const scanType = location.pathname.includes("url") ? "url" : "email";

  useEffect(() => {
    setContent("");
    setError("");
  }, [scanType]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please enter content to scan.");
      return;
    }
    setError("");
    setIsScanning(true);

    try {
      const result = await submitScan(content, scanType);
      navigate(`/detection/result/${result.scan._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze content. Please try again.");
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          {scanType === 'email' ? <Mail className="w-8 h-8 text-primary" /> : <Globe className="w-8 h-8 text-primary" />}
          Scan {scanType === 'email' ? 'Email' : 'URL'}
        </h1>
        <p className="text-ink-light mt-2">
          Submit {scanType === 'email' ? 'an email body or subject' : 'a suspicious link'} for deep analysis using our personalized detection engine.
        </p>
      </header>

      {error && (
        <div className="bg-danger-50 text-danger p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleScan} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-ink mb-2">
            Paste {scanType === 'email' ? 'Email Content' : 'URL'} Here
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isScanning}
            className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-50 transition-all resize-none"
            placeholder={scanType === 'email' ? 'Paste the suspicious email text here...' : 'https://suspicious-site.com/login'}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isScanning || !content.trim()}>
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
              </>
            ) : (
              'Analyze Now'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
