import { motion } from "framer-motion";
import { passwordStrength } from "../../hooks/useFormValidation";

const colors = ["#E2E8F0", "#EF4444", "#F59E0B", "#14B8A6", "#22C55E"];

export default function PasswordStrengthMeter({ password }) {
  const { score, label } = passwordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: score >= i ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: colors[score] }}
            />
          </div>
        ))}
      </div>
      <span className="text-xs mt-1 inline-block font-medium" style={{ color: colors[score] }}>
        {label}
      </span>
    </div>
  );
}
