import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useFormValidation, validateEmail, validatePassword } from "../hooks/useFormValidation";
import { useToast } from "../context/ToastContext";
import { useAppData } from "../context/AppDataContext";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAppData();
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const { values, setValue, handleBlur, validateAll, errorFor } = useFormValidation(
    { email: "", password: "" },
    { email: validateEmail, password: (v) => validatePassword(v, { min: 6 }) }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast("Please fix the errors below.", "warning");
      return;
    }

    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);

    if (result.ok) {
      toast("Welcome back! Logging you in...", "success");
      navigate("/dashboard");
      return;
    }

    if (result.offline) {
      toast("Offline mode — logging you in locally.", "info");
      navigate("/dashboard");
      return;
    }

    toast(result.message, "warning");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-lift overflow-hidden">
        {/* Illustration side */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary to-primary-700 p-12 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          <h3 className="text-white font-bold text-xl mt-8 text-center relative z-10">Welcome back to ShieldIQ</h3>
          <p className="text-primary-100 text-sm text-center mt-3 max-w-xs relative z-10 opacity-90">
            Your scan history, progress, and badges are waiting for you.
          </p>
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 flex flex-col justify-center"
        >
          <Link to="/" className="flex items-center gap-2 font-extrabold text-ink mb-8">
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </span>
            ShieldIQ
          </Link>
          <h1 className="text-2xl font-extrabold text-ink mb-2">Log in to your account</h1>
          <p className="text-sm text-ink-light mb-8">Stay ahead of scammers — pick up right where you left off.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => setValue("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={errorFor("email")}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => setValue("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              error={errorFor("password")}
            />

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-ink-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => toast("Password reset isn't available yet.", "info")}
                className="text-primary font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading} icon={loading ? undefined : ArrowRight} iconPosition="right">
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <div className="relative py-2 text-center">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </span>
              <span className="relative bg-white px-3 text-xs text-ink-faint">or continue with</span>
            </div>

            <button
              type="button"
              onClick={() => toast("Google login is currently unavailable. Please use email and password.", "info")}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-ink hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.4 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.2 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.4 5.1 29.5 3 24 3 16 3 9.2 7.6 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 45c5.4 0 10.2-1.8 14-5l-6.5-5.3c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.1 40.4 16 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.3C41.8 35.8 45 30.4 45 24c0-1.4-.1-2.4-.4-3.5z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-sm text-ink-light text-center mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
