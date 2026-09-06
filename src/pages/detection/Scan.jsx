import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Globe, ShieldAlert, Loader2, ScanSearch } from "lucide-react";
import Button from "../../components/ui/Button";
import { submitScan } from "../../services/detectionService";

export default function Scan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialMode = searchParams.get("mode") === "url" ? "url" : "email";
  const [scanType, setScanType] = useState(initialMode);
  
  const [content, setContent] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // When mode changes in URL, update state
    const mode = searchParams.get("mode") === "url" ? "url" : "email";
    if (mode !== scanType) {
      setScanType(mode);
      setContent("");
      setError("");
    }
  }, [searchParams]);

  const handleTabChange = (mode) => {
    setScanType(mode);
    setSearchParams({ mode });
    setContent("");
    setError("");
  };

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
      // result is { result, savedToHistory, scanId, scan }
      if (result.scanId) {
        navigate(`/detection/result/${result.scanId}`);
      } else {
        // Not logged in or save failed — navigate to history with state
        navigate('/detection/history');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze content. Please try again.");
      setIsScanning(false);
    }
  };


  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          <ScanSearch className="w-8 h-8 text-primary" />
          DetectIQ Scanner
        </h1>
        <p className="text-ink-light mt-2">
          Analyze a suspicious email or URL using multiple sources of evidence.
        </p>
      </header>

      {/* Mode Selector */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-full max-w-sm">
        <button
          onClick={() => handleTabChange('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            scanType === 'email'
              ? 'bg-white text-primary shadow-sm'
              : 'text-ink-light hover:text-ink'
          }`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
        <button
          onClick={() => handleTabChange('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            scanType === 'url'
              ? 'bg-white text-primary shadow-sm'
              : 'text-ink-light hover:text-ink'
          }`}
        >
          <Globe className="w-4 h-4" /> URL
        </button>
      </div>

      <div className="bg-primary-50 text-primary-900 p-4 rounded-xl text-sm mb-6">
        {scanType === 'email' 
          ? "DetectIQ can compare the email with your saved legitimate email patterns to provide more personalized analysis."
          : "DetectIQ checks the URL using security analysis and threat intelligence."}
      </div>

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
