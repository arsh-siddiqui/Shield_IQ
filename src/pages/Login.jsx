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

    if (result.ok || result.offline) {
      toast("Welcome back! Logging you in...", "success");
      navigate("/dashboard");
      return;
    }

    toast(result.message, "warning");
  };

  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl min-h-[640px] grid lg:grid-cols-12 bg-card rounded-3xl shadow-elevated overflow-hidden relative z-10">
        
        {/* Left 45% Visual Panel */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-[#050B16] via-[#081120] to-[#0D1728] p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 via-transparent to-accent-violet/10 pointer-events-none" />
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-violet flex items-center justify-center text-white shadow-soft">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-heading font-black text-xl text-white tracking-tight">DetectIQ</span>
          </Link>

          {/* Statement & Highlights */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" /> Security Portal
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight mb-4 leading-tight">
              Real-time threat detection & intelligence.
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              Protecting your digital assets across emails, URLs, messages, and QR payloads.
            </p>

            <div className="space-y-4">
              {[
                "Multi-Channel AI Classifiers",
                "Personalized Safe Baselines (RAG)",
                "Global Threat Intel Cross-Check",
                "Interactive Vulnerability Learning"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs font-medium text-slate-500">
            © 2026 DetectIQ Inc. All rights reserved.
          </div>
        </div>

        {/* Right 55% Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-card"
        >
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary tracking-tight mb-2">Welcome Back</h1>
              <p className="text-sm text-secondary font-medium">Sign in to your DetectIQ dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="name@company.com"
                  value={values.email}
                  onChange={(e) => setValue("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={errorFor("email")}
                />
              </div>

              <div>
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
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2.5 text-secondary font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-accent-blue cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast("Password reset instructions sent if email exists.", "info")}
                  className="text-accent-blue font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-gradient-to-r from-accent-blue to-accent-violet hover:opacity-95 text-white py-3.5 rounded-xl font-bold shadow-soft transition-all text-sm disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in to Dashboard"}
              </button>
            </form>

            <div className="pt-8 text-center">
              <p className="text-xs text-secondary font-medium">
                Don't have an account yet?{" "}
                <Link to="/register" className="text-accent-blue font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
