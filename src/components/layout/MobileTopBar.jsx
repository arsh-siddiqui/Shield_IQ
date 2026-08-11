import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ScanLine, Gamepad2, BookOpen, User, ShieldCheck, Menu, X, Settings2, Bot } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "AI Scanner", to: "/scanner", icon: ScanLine },
  { label: "AI Assistant", to: "/assistant", icon: Bot },
  { label: "Scam Simulator", to: "/simulator", icon: Gamepad2 },
  { label: "Learn", to: "/learn", icon: BookOpen },
  { label: "Profile", to: "/profile", icon: User },
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
          ShieldIQ
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
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? "text-primary bg-primary-50" : "text-ink-light"
                    }`
                  }
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </NavLink>
              ))}
              {user?.isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
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
