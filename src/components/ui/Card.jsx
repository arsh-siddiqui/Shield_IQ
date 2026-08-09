import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false, as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      whileHover={hover ? { y: -4, boxShadow: "0 16px 40px rgba(30,41,59,0.10)" } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-soft border border-slate-100 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
