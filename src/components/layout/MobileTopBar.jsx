import { useState, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ScanLine, ShieldAlert, History, Shield, FileSearch, TrendingUp, BookOpen, User, ShieldCheck, Menu, X, Settings2, Bot, Target } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";

const navSections = [
  {
    title: "",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Detection",
    items: [
      { label: "Scan Email", to: "/detection/email", icon: ScanLine },
      { label: "Scan URL", to: "/detection/url", icon: ShieldAlert },
      { label: "Scan History", to: "/detection/history", icon: History },
    ]
  },
  {
    title: "Security Intelligence",
    items: [
      { label: "Email Context", to: "/security/email-context", icon: FileSearch },
      { label: "Detection Evidence", to: "/security/evidence", icon: Shield },
      { label: "Security Profile", to: "/security/profile", icon: TrendingUp },
    ]
  },
  {
    title: "Vulnerability Learning",
    items: [
      { label: "Vulnerabilities", to: "/vulnerabilities", icon: BookOpen },
      { label: "My Progress", to: "/learning/progress", icon: Target },
    ]
  },
  {
    title: "",
    items: [
      { label: "AI Assistant", to: "/assistant", icon: Bot },
      { label: "Profile", to: "/profile", icon: User },
    ]
  }
];

export default function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const { user } = useAppData();
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2 font-extrabold text-ink">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-white" />
          </span>
          DetectIQ
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            {user.avatar}
          </div>
          <button onClick={() => setOpen(!open)} className="p-2 text-ink">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="flex flex-col p-3 gap-1">
              {navSections.map((section, idx) => (
                <Fragment key={idx}>
                  {section.title && (
                    <div className="text-xs font-bold text-ink-faint uppercase tracking-wider mt-2 mb-1 px-4">
                      {section.title}
                    </div>
                  )}
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                          isActive ? "text-primary bg-primary-50" : "text-ink-light"
                        }`
                      }
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      {item.label}
                    </NavLink>
                  ))}
                </Fragment>
              ))}
              {user?.isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold mt-2 ${
                      isActive ? "text-primary bg-primary-50" : "text-ink-light"
                    }`
                  }
                >
                  <Settings2 className="w-4.5 h-4.5" />
                  Admin
                </NavLink>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
