import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ label, icon: Icon, error, className = "", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = props.type === "password";
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : props.type || "text";

  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-primary mb-1.5">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        )}
        <input
          className={`w-full bg-card border border-border rounded-xl ${
            Icon ? "pl-10" : "pl-4"
          } ${isPasswordField ? "pr-10" : "pr-4"} py-3 text-sm font-medium text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all shadow-sm ${className}`}
          {...props}
          type={inputType}
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="block text-xs font-bold text-danger mt-1.5">{error}</span>}
    </label>
  );
}
