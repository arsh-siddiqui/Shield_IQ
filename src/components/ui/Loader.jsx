import { motion } from "framer-motion";

const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-[3px]" };

export default function Loader({ size = "md", className = "" }) {
  return (
    <motion.span
      className={`inline-block rounded-full border-primary border-t-transparent ${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}
