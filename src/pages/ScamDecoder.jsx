import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Tooltip from "../components/ui/Tooltip";
import { decoderExamples, decoderLegend } from "../data/dummyData";

const tagStyles = {
  fear: "bg-danger-50 text-danger underline decoration-danger decoration-2 underline-offset-2",
  urgency: "bg-accent-50 text-accent-600 underline decoration-accent decoration-2 underline-offset-2",
  authority: "bg-primary-50 text-primary-700 underline decoration-primary decoration-2 underline-offset-2",
  grammar: "bg-secondary-50 text-secondary-600 underline decoration-secondary decoration-2 underline-offset-2",
  credential: "bg-danger-50 text-danger underline decoration-danger decoration-2 underline-offset-2",
  "fake-link": "bg-primary-50 text-primary-700 underline decoration-primary decoration-2 underline-offset-2",
};

const dotStyles = {
  fear: "bg-danger",
  urgency: "bg-accent",
  authority: "bg-primary",
  grammar: "bg-secondary",
  credential: "bg-danger",
  "fake-link": "bg-primary",
};

export default function ScamDecoder() {
  const navigate = useNavigate();
  const [exampleId, setExampleId] = useState(decoderExamples[0].id);
  const d = decoderExamples.find((e) => e.id === exampleId);

  return (
    <AppLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-ink-light hover:text-ink mb-6">
        <Icons.ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Scam Decoder</h1>
          <p className="text-sm text-ink-light mt-1">
            Hover or tap the highlighted parts to see exactly why they're suspicious.
          </p>
        </div>
        <div className="flex gap-2">
          {decoderExamples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setExampleId(ex.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                exampleId === ex.id ? "bg-primary text-white" : "bg-white border border-slate-200 text-ink-light"
              }`}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 sm:p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <Badge tone="neutral" icon={Icons.MessageSquare}>{d.channel}</Badge>
            <span className="text-xs text-ink-faint">{d.title}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={d.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 rounded-2xl p-6 text-[15px] leading-loose text-ink"
            >
              {d.segments.map((seg, i) =>
                seg.tag ? (
                  <Tooltip key={i} content={seg.explanation}>
                    <span className={`px-1 py-0.5 rounded cursor-help font-medium ${tagStyles[seg.tag]}`}>
                      {seg.text}
                    </span>
                  </Tooltip>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
            {decoderLegend.map((l) => (
              <div key={l.tag} className="flex items-center gap-2 text-xs text-ink-light">
                <span className={`w-3 h-3 rounded-full ${dotStyles[l.tag]}`} />
                {l.label}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
            <Icons.GraduationCap className="w-4 h-4 text-primary" />
            In simple English
          </h3>
          <p className="text-sm text-ink-light leading-relaxed mb-4">
            {d.id === "bank-sms"
              ? "This message pretends to be your bank. It uses fear (blocking your account) and false urgency (24-hour deadline) to rush you into clicking a link that isn't actually your bank's website."
              : "This message invents a fake job title to sound official, contains spelling mistakes a real company wouldn't make, and asks for your password directly — something no real IT team ever needs."}
          </p>
          <div className="bg-primary-50 rounded-xl p-4 flex items-start gap-3">
            <Icons.ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-700 leading-relaxed">
              {d.id === "bank-sms"
                ? "Real banks never threaten account closure over a single unanswered message, and their links always use their official domain."
                : "Real IT support can always fix issues without asking for your password, and legitimate companies proofread their communications."}
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <Button className="flex-1" variant="secondary" icon={Icons.Gamepad2} onClick={() => navigate("/simulator")}>
              Practice This Scenario
            </Button>
            <Button className="flex-1" variant="outline" icon={Icons.BookOpen} onClick={() => navigate("/learn")}>
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
