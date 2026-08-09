import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const tones = {
  success: "border-success-500 text-success",
  warning: "border-accent-500 text-accent-600",
  info: "border-primary-500 text-primary-600",
};

export default function Notification({ notifications = [], onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-80 max-w-[90vw]">
      <AnimatePresence>
        {notifications.map((n) => {
          const Icon = icons[n.type] || Info;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-xl shadow-lift border-l-4 ${tones[n.type] || tones.info} p-4 flex items-start gap-3`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tones[n.type] || tones.info}`} />
              <div className="flex-1 text-sm text-ink">{n.message}</div>
              <button onClick={() => onDismiss(n.id)} className="text-ink-faint hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
