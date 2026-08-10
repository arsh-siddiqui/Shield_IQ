import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { scannerTabs } from "../data/dummyData";
import { useAppData } from "../context/AppDataContext";
import { useToast } from "../context/ToastContext";

const scanStages = [
  "Reading content...",
  "Checking known threat patterns...",
  "Analyzing language & urgency cues...",
  "Verifying links & domains...",
  "Finalizing risk score...",
];

export default function AIScanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addScan, runScan } = useAppData();
  const { toast } = useToast();

  const initialTab = location.state?.tab || "url";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [value, setValue] = useState("");
  const [qrUploaded, setQrUploaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const activeConfig = scannerTabs.find((t) => t.id === activeTab);
  const hasInput = activeTab === "qr" ? qrUploaded : value.trim().length > 0;

  const handleAnalyze = async () => {
    if (!hasInput) {
      toast("Paste or upload something to analyze first.", "warning");
      return;
    }
    setScanning(true);
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((i) => {
        const next = i + 1;
        if (next >= scanStages.length - 1) clearInterval(interval);
        return next;
      });
    }, 400);

    const inputText = activeTab === "qr" ? "https://parking-pay-scan.info/checkout" : value;
    const target =
      activeTab === "qr"
        ? "Uploaded QR code"
        : inputText.length > 60
        ? inputText.slice(0, 60).trim() + "..."
        : inputText;

    // Runs the real backend analysis (falling back to the identical local
    // heuristic if the API isn't reachable) in parallel with the fixed
    // visual timer below, so the scanning animation feels the same length
    // regardless of whether the backend answered.
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2200));
    const [result] = await Promise.all([runScan(inputText, activeTab), minDelay]);

    clearInterval(interval);

    addScan({
      type: activeConfig.label,
      target: target || "(empty input)",
      risk: result.riskLevel.replace(" Risk", ""),
      result,
    });

    setScanning(false);
    navigate("/scan-result", { state: { result, target } });
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink">AI Scanner</h1>
        <p className="text-sm text-ink-light mt-1">Paste anything suspicious below — we'll break it down for you.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {scannerTabs.map((tab) => {
          const Icon = Icons[tab.icon] || Icons.Search;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setValue("");
                setQrUploaded(false);
              }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive ? "bg-primary text-white shadow-lift" : "bg-white text-ink-light border border-slate-200 hover:border-primary/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Card className="p-6 sm:p-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {!scanning ? (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {activeTab === "qr" ? (
                <button
                  type="button"
                  onClick={() => setQrUploaded(true)}
                  className={`w-full border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                    qrUploaded ? "border-secondary bg-secondary-50" : "border-slate-200 hover:border-primary/50"
                  }`}
                >
                  {qrUploaded ? (
                    <>
                      <Icons.CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <p className="text-sm font-semibold text-ink mb-1">parking-qr-photo.png uploaded</p>
                      <p className="text-xs text-ink-faint">Click Analyze to scan this QR code</p>
                    </>
                  ) : (
                    <>
                      <Icons.QrCode className="w-12 h-12 text-ink-faint mx-auto mb-4" />
                      <p className="text-sm font-semibold text-ink mb-1">Upload a QR code image</p>
                      <p className="text-xs text-ink-faint">PNG, JPG up to 5MB — click to simulate an upload</p>
                    </>
                  )}
                </button>
              ) : (
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={activeConfig.placeholder}
                  rows={activeTab === "url" ? 3 : 8}
                  className="w-full rounded-2xl border border-slate-200 p-5 text-sm text-ink placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-50 outline-none transition resize-none"
                />
              )}

              <div className="flex items-center justify-between mt-6">
                <p className="text-xs text-ink-faint flex items-center gap-1.5">
                  <Icons.Lock className="w-3.5 h-3.5" />
                  Your data is analyzed securely and never shared.
                </p>
                <Button icon={Icons.ScanSearch} onClick={handleAnalyze} disabled={!hasInput}>
                  Analyze
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div className="absolute inset-0 rounded-full border-4 border-primary-100" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.ShieldCheck className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-ink mb-2">Scanning in progress...</h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={stageIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-ink-light"
                >
                  {scanStages[stageIndex]}
                </motion.p>
              </AnimatePresence>
              <div className="w-full max-w-xs h-1.5 rounded-full bg-slate-100 overflow-hidden mt-6">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="max-w-3xl mt-4 flex items-start gap-2 text-xs text-ink-faint">
        <Icons.Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        ShieldIQ analyzes input content against multi-layer threat intelligence and machine learning models to detect risk.
      </div>
    </AppLayout>
  );
}
