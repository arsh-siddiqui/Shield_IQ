import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import { useAppData } from "../../context/AppDataContext";

const searchTargets = [
  { label: "Dashboard", to: "/dashboard", keywords: ["home", "dash", "metrics"] },
  { label: "Scan Email", to: "/detection/email", keywords: ["scan", "email", "analyze"] },
  { label: "Scan URL", to: "/detection/url", keywords: ["scan", "url", "link", "website"] },
  { label: "Scan History", to: "/detection/history", keywords: ["history", "past", "results"] },
  { label: "Email Context", to: "/security/email-context", keywords: ["email", "context", "history", "rag"] },
  { label: "Security Profile", to: "/security/profile", keywords: ["profile", "security", "strengths", "weaknesses"] },
  { label: "Vulnerabilities", to: "/vulnerabilities", keywords: ["vulnerability", "learn", "course", "practice"] },
  { label: "My Progress", to: "/learning/progress", keywords: ["progress", "stats", "assessments"] },
  { label: "AI Assistant", to: "/assistant", keywords: ["assistant", "ai", "chat", "ask", "help"] },
  { label: "Profile", to: "/profile", keywords: ["profile", "settings"] },
  { label: "Admin Dashboard", to: "/admin", keywords: ["admin", "users", "manage"] },
];

export default function DesktopTopBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAppData();

  const availableTargets = user?.isAdmin 
    ? searchTargets 
    : searchTargets.filter(t => t.to !== "/admin");

  const results = query
    ? availableTargets.filter(
        (t) => t.label.toLowerCase().includes(query.toLowerCase()) || t.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : [];

  const goTo = (to) => {
    setQuery("");
    setOpen(false);
    navigate(to);
  };

  return (
    <div className="hidden lg:flex items-center justify-between px-8 pt-6 gap-4 relative">
      <div className="relative w-full max-w-sm">
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setOpen(true);
          }}
          placeholder="Search pages, tools, lessons..."
        />
        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lift border border-slate-100 overflow-hidden z-40">
            {results.map((r) => (
              <button
                key={r.to}
                onClick={() => goTo(r.to)}
                className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-slate-50 transition"
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
