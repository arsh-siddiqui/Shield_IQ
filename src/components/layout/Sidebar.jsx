import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ScanLine, ShieldAlert, History, Shield, FileSearch, TrendingUp, BookOpen, User, ShieldCheck, Settings2, LogOut, Bot, Target } from "lucide-react";
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
      { label: "Scanner", to: "/detection/scanner", icon: ScanLine },
      { label: "History", to: "/detection/history", icon: History },
      { label: "My Email Patterns", to: "/detection/email-context", icon: FileSearch },
    ]
  },
  {
    title: "Security",
    items: [
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

export default function Sidebar() {
  const { user, xp, logout } = useAppData();
  const level = Math.max(1, Math.floor((xp || 0) / 300) + 1);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-slate-100 py-6 px-4">
      <div className="flex items-center gap-2 font-extrabold text-lg text-ink px-2 mb-8">
        <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </span>
        DetectIQ
      </div>

      <nav className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 pb-4 hide-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <div className="text-xs font-bold text-ink-faint uppercase tracking-wider mb-2 px-4">
                {section.title}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? "text-primary bg-primary-50" : "text-ink-light hover:bg-slate-50 hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl bg-primary-50"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-4.5 h-4.5 relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {user?.isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold mb-2 transition-colors ${
              isActive ? "text-primary bg-primary-50" : "text-ink-light hover:bg-slate-50 hover:text-ink"
            }`
          }
        >
          <Settings2 className="w-4.5 h-4.5" />
          Admin
        </NavLink>
      )}

      <div className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-slate-50 mt-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink truncate">{user.name}</div>
            <div className="text-xs text-ink-faint truncate">Level {level} · {user.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-ink-faint hover:text-danger hover:bg-danger-50 rounded-lg transition-colors flex-shrink-0" title="Log Out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
