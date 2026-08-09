import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Tooltip({ children, content, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl bg-ink text-white text-xs leading-relaxed p-3 shadow-lift pointer-events-none"
          >
            {content}
            <span className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-ink rotate-45 -mt-1" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
