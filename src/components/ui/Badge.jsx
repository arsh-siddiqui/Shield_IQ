const tones = {
  primary: "bg-primary-50 text-primary-700",
  secondary: "bg-secondary-50 text-secondary-600",
  accent: "bg-accent-50 text-accent-600",
  danger: "bg-danger-50 text-danger",
  success: "bg-success-50 text-success",
  neutral: "bg-slate-100 text-ink-light",
};

export default function Badge({ children, tone = "neutral", icon: Icon, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
