import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle, ShieldCheck, Mail, Link as LinkIcon, MessageSquare, QrCode, Image as ImageIcon, Brain, FileSearch, GraduationCap, ChevronRight, Activity, Search, ShieldAlert, CheckCircle2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";

const capabilities = [
  { icon: ShieldCheck, text: "Multi-Channel Detection" },
  { icon: Brain, text: "Personalized Email Detection" },
  { icon: Activity, text: "Threat Intelligence" },
  { icon: GraduationCap, text: "Vulnerability Learning" }
];

const features = [
  { title: "Email Detection", icon: Mail, description: "Analyze senders, links, and intent using AI and personalized baselines." },
  { title: "URL Intelligence", icon: LinkIcon, description: "Check domains against global threat databases instantly." },
  { title: "Message Detection", icon: MessageSquare, description: "Spot phishing in SMS, WhatsApp, and social media texts." },
  { title: "QR Analysis", icon: QrCode, description: "Decode and scan QR payloads before opening them." },
  { title: "Screenshot Analysis", icon: ImageIcon, description: "Extract and scan embedded URLs and texts from images." },
  { title: "Personalized Patterns", icon: FileSearch, description: "ML learns your safe contacts to reduce false positives." },
  { title: "AI Explanations", icon: Brain, description: "Plain-English breakdowns of exactly why a threat is dangerous." },
  { title: "Vulnerability Learning", icon: GraduationCap, description: "Master security concepts with interactive, bite-sized lessons." },
];

const workflowSteps = [
  { step: "01", label: "Input", desc: "Provide an email, URL, text, QR, or image." },
  { step: "02", label: "Analyze", desc: "AI and threat engines process the data instantly." },
  { step: "03", label: "Evidence", desc: "We cross-reference with global databases & your patterns." },
  { step: "04", label: "Result", desc: "Get a clear risk score and actionable recommendation." }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent-blue/30">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-border/40">
        {/* Subtle Background Atmospheric Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center min-h-[calc(88vh-72px)]">
          
          {/* Left: Content (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              AI-Powered Cybersecurity Engine
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[1.05] tracking-tight mb-6">
              <span className="block text-primary">Detect.</span>
              <span className="block text-primary">Defend.</span>
              <span className="block bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-violet bg-clip-text text-transparent">Stay Ahead.</span>
            </h1>
            
            <p className="text-lg text-secondary font-medium leading-relaxed mb-8 max-w-lg">
              DetectIQ uses real-time ML classifiers and threat intelligence to analyze emails, links, QR codes, and text messages—neutralizing scams before they reach you.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-violet hover:opacity-95 text-white rounded-xl font-bold shadow-soft transition-all text-base"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate("/detection/email")}
                className="px-8 py-4 bg-card/60 hover:bg-secondary border border-border/60 hover:border-primary text-primary rounded-xl font-bold transition-all inline-flex items-center gap-2 text-base"
              >
                Explore Detection
                <ArrowRight className="w-4 h-4 text-accent-blue" />
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-border/40 max-w-lg">
              <div>
                <div className="text-2xl font-black font-heading text-primary">99.8%</div>
                <div className="text-xs text-muted font-medium mt-0.5">Detection Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-black font-heading text-primary">&lt;500ms</div>
                <div className="text-xs text-muted font-medium mt-0.5">Analysis Latency</div>
              </div>
              <div>
                <div className="text-2xl font-black font-heading text-primary">Multi-Layer</div>
                <div className="text-xs text-muted font-medium mt-0.5">ML + RAG + Threat Engine</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Integrated Shield Environment (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Atmospheric Lighting Behind Shield */}
            <div className="absolute w-[420px] h-[420px] bg-gradient-to-tr from-accent-blue/30 via-accent-cyan/20 to-accent-violet/30 rounded-full blur-[80px] pointer-events-none animate-pulse" />

            {/* Floating Signal Nodes */}
            <div className="absolute top-4 left-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md text-xs font-semibold text-accent-blue shadow-soft flex items-center gap-2 border border-accent-blue/20 z-20 animate-float">
              <span className="w-2 h-2 rounded-full bg-accent-blue" /> Live Threat Scan Active
            </div>
            
            <div className="absolute bottom-6 right-0 px-3.5 py-2 rounded-2xl bg-card/80 backdrop-blur-md text-xs font-semibold text-primary shadow-soft flex items-center gap-2.5 border border-border/40 z-20">
              <ShieldCheck className="w-4 h-4 text-accent-blue" /> Zero-Trust Validation
            </div>

            {/* Shield Asset Seamlessly Blended */}
            <div className="relative z-10 p-2">
              <img 
                src="/assets/detectiq-hero-shield.png" 
                alt="DetectIQ Real-Time Cybersecurity Shield" 
                className="w-full max-w-[460px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.25)] rounded-3xl"
                loading="eager"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* CAPABILITY STRIP */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {capabilities.map((cap, i) => (
              <div key={i} className="py-6 px-4 flex flex-col items-center justify-center text-center gap-3">
                <cap.icon className="w-6 h-6 text-accent-blue" />
                <span className="text-sm font-bold text-primary">{cap.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (TIMELINE) */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-primary mb-4">How DetectIQ Works</h2>
            <p className="text-secondary font-medium">A seamless pipeline from submission to security.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-border" />
            
            {workflowSteps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center font-heading font-black text-xl text-accent-blue mb-6">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{step.label}</h3>
                <p className="text-sm text-secondary leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-primary mb-4">Comprehensive Detection Suite</h2>
            <p className="text-secondary font-medium text-lg">Every tool you need to analyze, understand, and neutralize digital threats across all channels.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-background border border-border p-6 rounded-3xl hover:border-accent-blue/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-6 group-hover:bg-accent-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="text-base font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY LEARNING SECTION */}
      <section className="py-24 bg-background border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-blue/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-primary mb-6">Learn to spot what AI spots.</h2>
            <p className="text-lg text-secondary leading-relaxed mb-8">
              Detection is only half the battle. DetectIQ includes an interactive vulnerability learning platform. Understand the anatomy of phishing attacks, practice identifying red flags, and test your knowledge.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Interactive code & text examples",
                "Real-world phishing scenarios",
                "Personalized progress tracking",
                "Targeted assessments"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-primary font-medium">
                  <CheckCircle2 className="w-5 h-5 text-accent-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate("/vulnerabilities")}
              className="px-6 py-3 bg-card border border-border hover:border-primary text-primary rounded-xl font-bold transition-all inline-flex items-center gap-2 shadow-sm"
            >
              Explore Learning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-elevated relative">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Vulnerable Example</div>
                  <div className="p-4 bg-background rounded-xl border border-border font-mono text-sm text-secondary">
                    {'<a href="http://secure-login-update.com">'}
                    <br/>
                    &nbsp;&nbsp;Update Account Settings
                    <br/>
                    {'</a>'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Secure Fix</div>
                  <div className="p-4 bg-accent-blue/10 rounded-xl border border-accent-blue/20 font-mono text-sm text-primary">
                    {'<a href="https://yourbank.com/settings">'}
                    <br/>
                    &nbsp;&nbsp;Update Account Settings
                    <br/>
                    {'</a>'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-card text-center px-6">
        <div className="max-w-3xl mx-auto">
          <ShieldCheck className="w-16 h-16 text-accent-blue mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-heading font-black text-primary mb-6">Stay ahead of digital threats with DetectIQ.</h2>
          <p className="text-xl text-secondary mb-10 max-w-xl mx-auto">
            Join the platform that combines elite AI detection with interactive security learning.
          </p>
          <button 
            onClick={() => navigate("/register")}
            className="px-10 py-5 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-xl font-bold shadow-soft transition-all text-lg"
          >
            Create Your Account
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
