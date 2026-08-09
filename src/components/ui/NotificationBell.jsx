import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";

const icons = { success: CheckCircle2, warning: AlertTriangle, info: Info };
const tones = { success: "text-success bg-success-50", warning: "text-accent-600 bg-accent-50", info: "text-primary bg-primary-50" };

export default function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 transition text-ink-light"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-lift border border-slate-100 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-ink text-sm">Notifications</span>
              <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-primary flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 && (
                <div className="p-6 text-center text-sm text-ink-faint">You're all caught up.</div>
              )}
              {notifications.map((n) => {
                const Icon = icons[n.type] || Info;
                return (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                      !n.read ? "bg-primary-50/40" : ""
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tones[n.type] || tones.info}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink leading-snug">{n.title}</span>
                      <span className="block text-xs text-ink-light mt-0.5 leading-relaxed">{n.body}</span>
                      <span className="block text-[11px] text-ink-faint mt-1">{n.time}</span>
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
