import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Lock, User, GraduationCap, Briefcase, Building2, CheckCircle2 } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PasswordStrengthMeter from "../components/ui/PasswordStrengthMeter";
import { useFormValidation, validateEmail, validatePassword } from "../hooks/useFormValidation";
import { useAppData } from "../context/AppDataContext";
import { useToast } from "../context/ToastContext";

const roles = [
  { id: "Student", label: "Student", icon: GraduationCap },
  { id: "Professional", label: "Professional", icon: Briefcase },
  { id: "Business", label: "Business", icon: Building2 },
];

export default function Register() {
  const navigate = useNavigate();
  const { updateUser, register } = useAppData();
  const { toast } = useToast();
  const [role, setRole] = useState("Student");
  const [success, setSuccess] = useState(false);

  const { values, setValue, handleBlur, validateAll, errorFor } = useFormValidation(
    { name: "", email: "", password: "", confirmPassword: "" },
    {
      name: (v) => (!v ? "Full name is required" : ""),
      email: validateEmail,
      password: (v) => validatePassword(v, { min: 8 }),
      confirmPassword: (v) => (v !== values.password ? "Passwords don't match" : ""),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast("Please fix the errors below.", "warning");
      return;
    }

    const result = await register({
      name: values.name,
      email: values.email,
      password: values.password,
      accountRole: role,
    });

    if (result.ok) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1600);
      return;
    }

    if (result.offline) {
      // Backend isn't reachable — fall back to the local demo flow so the
      // app still works end-to-end without a server.
      updateUser({ name: values.name, email: values.email, role });
      toast("Running in offline demo mode — continuing without the backend.", "info");
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1600);
      return;
    }

    toast(result.message, "warning");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-lift overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 flex flex-col justify-center order-2 lg:order-1"
        >
          <Link to="/" className="flex items-center gap-2 font-extrabold text-ink mb-8">
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </span>
            ShieldIQ
          </Link>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-2xl font-extrabold text-ink mb-2">Create your free account</h1>
                <p className="text-sm text-ink-light mb-8">Takes less than a minute. No credit card needed.</p>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <Input
                    label="Full Name"
                    icon={User}
                    placeholder="Jordan Lee"
                    value={values.name}
                    onChange={(e) => setValue("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    error={errorFor("name")}
                  />
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
                  <div>
                    <Input
                      label="Password"
                      type="password"
                      icon={Lock}
                      placeholder="Create a password"
                      value={values.password}
                      onChange={(e) => setValue("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      error={errorFor("password")}
                    />
                    <PasswordStrengthMeter password={values.password} />
                  </div>
                  <Input
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    placeholder="Re-enter your password"
                    value={values.confirmPassword}
                    onChange={(e) => setValue("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    error={errorFor("confirmPassword")}
                  />

                  <div>
                    <span className="block text-sm font-medium text-ink mb-2">I am a...</span>
                    <div className="grid grid-cols-3 gap-3">
                      {roles.map((r) => (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-xs font-semibold transition-colors ${
                            role === r.id
                              ? "border-primary bg-primary-50 text-primary"
                              : "border-slate-200 text-ink-light hover:border-slate-300"
                          }`}
                        >
                          <r.icon className="w-5 h-5" />
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-2">
                    Create Account
                  </Button>
                </form>

                <p className="text-sm text-ink-light text-center mt-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Log in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </motion.div>
                <h2 className="text-xl font-extrabold text-ink mb-2">Welcome to ShieldIQ!</h2>
                <p className="text-sm text-ink-light">Setting up your dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-secondary to-secondary-600 p-12 relative overflow-hidden order-1 lg:order-2">
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <User className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          <h3 className="text-white font-bold text-xl mt-8 text-center relative z-10">Join 94,500+ protected users</h3>
          <p className="text-white/80 text-sm text-center mt-3 max-w-xs relative z-10">
            Start learning to spot scams in minutes, not months.
          </p>
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
