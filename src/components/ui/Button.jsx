import { motion } from "framer-motion";

const variants = {
  primary: "bg-accent-blue text-white shadow-soft hover:bg-accent-blue/90 border border-transparent",
  secondary: "bg-elevated text-primary border border-border hover:border-primary hover:text-primary",
  outline: "bg-transparent text-primary border border-border hover:border-primary hover:text-primary hover:bg-secondary",
  ghost: "bg-transparent text-secondary hover:bg-secondary hover:text-primary",
  accent: "bg-accent-blue text-white shadow-soft hover:bg-accent-blue/90 border border-transparent",
  danger: "bg-danger text-white shadow-soft hover:opacity-90 border border-transparent",
};

const sizes = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
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
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </motion.button>
  );
}
