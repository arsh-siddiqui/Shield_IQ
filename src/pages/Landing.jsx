import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowRight, PlayCircle, Mail, ShieldAlert, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Counter from "../components/ui/Counter";
import Accordion from "../components/ui/Accordion";
import {
  heroStats,
  howItWorks,
  landingFeatures,
  testimonials,
  faqs,
} from "../data/dummyData";
import { colorBg50, colorText } from "../utils/colorMaps";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sampleMessages = [
  {
    sender: "alerts@bank-secure-verify.net",
    subject: "Account Suspension Notice",
    preview: "Dear Customer, your account will be blocked within 24 hours. Click here immediately to verify...",
    risk: 92,
    verdict: "High Risk",
    safe: false,
  },
  {
    sender: "hr@global-careers-hire.net",
    subject: "You've Been Selected — Pay to Start",
    preview: "Congratulations! Pay a refundable Rs. 499 registration fee to unlock your first work-from-home task...",
    risk: 78,
    verdict: "High Risk",
    safe: false,
  },
  {
    sender: "no-reply@github.com",
    subject: "Your weekly digest is ready",
    preview: "Here's what happened in your repositories this week. 3 pull requests were merged...",
    risk: 4,
    verdict: "Safe",
    safe: true,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [sampleIndex, setSampleIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const sampleItem = sampleMessages[sampleIndex];

  const scanNext = () => {
    setScanning(true);
    setTimeout(() => {
      setSampleIndex((i) => (i + 1) % sampleMessages.length);
      setScanning(false);
    }, 900);
  };

  return (
    <div className="bg-surface">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 relative grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}>
              <Badge tone="primary" icon={Icons.Sparkles}>AI-Powered Fraud Protection</Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink leading-[1.1] mt-5">
              Protect Yourself From <span className="text-primary">Online Scams</span> With AI
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-ink-light mt-6 leading-relaxed max-w-lg">
              ShieldIQ detects phishing attacks and teaches users how to stay safe through interactive learning.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8">
              <Button size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/register")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" icon={PlayCircle} onClick={() => navigate("/scanner")}>
                Scan a Message
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-2 mt-8 text-sm text-ink-light">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              Free to use · Interactive protection
            </motion.div>
          </motion.div>

          {/* Animated illustration: AI scanning an email */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Card className="p-6 max-w-md mx-auto relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scanning ? "scanning" : sampleIndex}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${sampleItem.safe ? "bg-success-50" : "bg-danger-50"}`}>
                        <Mail className={`w-5 h-5 ${sampleItem.safe ? "text-success" : "text-danger"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink truncate">{sampleItem.sender}</div>
                        <div className="text-xs text-ink-faint truncate">Subject: {sampleItem.subject}</div>
                      </div>
                    </div>
                    <p className="text-sm text-ink-light mt-4 leading-relaxed line-clamp-2">{sampleItem.preview}</p>
                    <div className="mt-5 flex items-center justify-between">
                      {scanning ? (
                        <Badge tone="neutral">Analyzing...</Badge>
                      ) : (
                        <Badge tone={sampleItem.safe ? "success" : "danger"} icon={sampleItem.safe ? ShieldCheck : ShieldAlert}>
                          {sampleItem.risk}% · {sampleItem.verdict}
                        </Badge>
                      )}
                      <motion.div
                        className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: scanning ? 0.6 : 1.6, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={scanNext}
                  disabled={scanning}
                  className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary border border-primary-100 bg-primary-50 rounded-xl py-2.5 hover:bg-primary-100 transition disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${scanning ? "animate-spin" : ""}`} />
                  Scan Another Message
                </button>
              </Card>
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 bg-secondary-100 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-100 rounded-full blur-2xl"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge tone="secondary">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4">Everything you need to stay safe</h2>
          <p className="text-ink-light mt-4">
            A complete toolkit that detects threats, explains them simply, and helps you build lasting habits.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingFeatures.map((f, i) => {
            const Icon = Icons[f.icon] || Icons.Shield;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card hover className="p-7 h-full">
                  <div className={`w-12 h-12 rounded-2xl ${colorBg50[f.color]} flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${colorText[f.color]}`} />
                  </div>
                  <h3 className="font-bold text-ink mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-light leading-relaxed">{f.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge tone="accent">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4">Four simple steps to safety</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200" />
          {howItWorks.map((step, i) => {
            const Icon = Icons[step.icon] || Icons.Circle;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="w-18 h-18 rounded-2xl bg-white shadow-soft flex items-center justify-center mx-auto mb-5 relative z-10 border border-slate-100">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed px-2">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-primary-50/40 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge tone="primary">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4">Trusted by people like you</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="p-7 h-full">
                  <p className="text-sm text-ink-light leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{t.name}</div>
                      <div className="text-xs text-ink-faint">{t.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24 scroll-mt-24">
        <div className="text-center mb-12">
          <Badge tone="secondary">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-4">Frequently asked questions</h2>
        </div>
        <Accordion items={faqs} />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Card className="bg-gradient-to-br from-primary to-primary-700 text-white p-12 text-center rounded-3xl shadow-lift border-none">
          <h2 className="text-3xl font-extrabold mb-3">Ready to outsmart scammers?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto opacity-90">
            Join thousands of users learning to detect fraud before it costs them anything.
          </p>
          <Button size="lg" variant="accent" onClick={() => navigate("/register")} icon={ArrowRight} iconPosition="right">
            Get Started Free
          </Button>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
