import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false, as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      whileHover={hover ? { y: -4, boxShadow: "var(--shadow-elevated)" } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-card rounded-card shadow-card border border-border ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
