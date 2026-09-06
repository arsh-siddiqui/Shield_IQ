import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { getScanHistory } from "../../services/detectionService";

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getScanHistory();
        setScans(data || []);
      } catch (err) {
        setError("Failed to load scan history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          Scan History
        </h1>
        <p className="text-ink-light mt-2">
          Review your past detection results and risk analysis.
        </p>
      </header>

      {error && (
        <div className="bg-danger-50 text-danger p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> {error}
        </div>
      )}

      {scans.length === 0 && !error ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink">No scans yet.</h3>
          <p className="text-sm text-ink-light mt-1">Submit an email or URL for analysis to see your history.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-ink-light uppercase tracking-wider">
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scans.map((scan) => (
                <tr key={scan._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-ink truncate max-w-xs">{scan.target}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-ink-light capitalize">{scan.scanType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold capitalize ${
                      scan.riskLevel === 'high' || scan.riskLevel === 'critical' ? 'bg-danger-50 text-danger' :
                      scan.riskLevel === 'medium' ? 'bg-warning-light text-warning-dark' :
                      'bg-success-50 text-success'
                    }`}>
                      {scan.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-ink-light">{new Date(scan.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/detection/result/${scan._id}`} className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-600 transition-colors">
                      View <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
