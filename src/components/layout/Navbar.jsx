import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Menu, X } from "lucide-react";
import Button from "../ui/Button";
import useScrollPosition from "../../hooks/useScrollPosition";

const links = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "About", to: "/#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const scrolled = useScrollPosition(24);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-all duration-300 ${
        scrolled ? "bg-white/95 border-slate-100 shadow-softer" : "bg-white/60 border-transparent"
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
        scrolled ? "h-16" : "h-20"
      }`}>
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-ink">
          <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </span>
          ShieldIQ
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="text-sm font-medium text-ink-light hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
            Get Started
          </Button>
        </div>

        <button className="md:hidden p-2 text-ink" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-100"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.label} href={l.to} className="text-sm font-medium text-ink-light">
                  {l.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
