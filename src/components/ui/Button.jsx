import { motion } from "framer-motion";

const variants = {
  primary: "bg-primary text-white shadow-lift hover:bg-primary-600",
  secondary: "bg-secondary text-white hover:bg-secondary-600",
  outline: "bg-white text-ink border border-slate-200 hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-ink-light hover:bg-slate-100",
  accent: "bg-accent text-white hover:bg-accent-600",
  danger: "bg-danger text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </motion.button>
  );
}
