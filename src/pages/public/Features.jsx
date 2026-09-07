import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Globe, MessageSquare, QrCode, Image as ImageIcon, Brain, GraduationCap, ArrowRight, Zap, Database, Lock } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Features() {
  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent-blue/30">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-12 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider mb-6">
          <Zap className="w-3.5 h-3.5" /> Capabilities Overview
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-primary tracking-tight mb-6 leading-tight">
          Next-generation threat detection, engineered for precision.
        </h1>
        <p className="text-lg text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
          Every tool in DetectIQ is built to analyze multi-channel content, cross-reference global intelligence, and explain threats in plain English.
        </p>
      </section>

      {/* Bento-Grid Composition */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Large Hero Feature Card */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl p-8 shadow-card border border-border/40 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary mb-3">Personalized Pattern RAG</h2>
              <p className="text-sm text-secondary leading-relaxed max-w-md">
                Our Retrieval-Augmented Generation pipeline learns your personal safe contact baselines to drastically eliminate false positives on safe emails.
              </p>
            </div>
            <div className="pt-6">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Machine Learning Engine
              </span>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 text-accent-violet flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-heading text-primary mb-3">Email Analysis</h2>
              <p className="text-sm text-secondary leading-relaxed">
                Parses headers, senders, links, and intent to catch spoofed domain attacks instantly.
              </p>
            </div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">High Accuracy</div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-heading text-primary mb-3">URL Threat Engine</h2>
              <p className="text-sm text-secondary leading-relaxed">
                Cross-checks URL domains against VirusTotal and PhishDestroy threat databases in under 500ms.
              </p>
            </div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">Global Feeds</div>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-heading text-primary mb-3">SMS & Text Scanner</h2>
              <p className="text-sm text-secondary leading-relaxed">
                Detects smishing, deceptive urgency, and malicious links inside mobile text messages.
              </p>
            </div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">Text ML</div>
          </div>

          {/* Feature Card 5 */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 text-accent-violet flex items-center justify-center mb-6">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-heading text-primary mb-3">QR Payload Decoder</h2>
              <p className="text-sm text-secondary leading-relaxed">
                Decodes QR images locally in browser without sending raw images to third parties.
              </p>
            </div>
            <div className="text-xs font-bold text-muted uppercase tracking-wider">Local Processing</div>
          </div>

          {/* Large Card 6 */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl p-8 shadow-card border border-border/40 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary mb-3">Interactive Vulnerability Learning</h2>
              <p className="text-sm text-secondary leading-relaxed max-w-md">
                Bite-sized modules covering XSS, SQLi, CSRF, and Phishing with interactive assessments and progress tracking.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-accent-blue hover:underline">
                Explore Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6 bg-card border-t border-border/40">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-black text-primary mb-4">Ready to test your content?</h2>
          <p className="text-secondary font-medium mb-8">Start scanning emails, links, and messages for free with DetectIQ.</p>
          <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-violet text-white rounded-xl font-bold shadow-soft inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
