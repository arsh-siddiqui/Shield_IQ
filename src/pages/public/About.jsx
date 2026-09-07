import { Link } from "react-router-dom";
import { ShieldCheck, Target, Users, Cpu, Award } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function About() {
  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent-blue/30">
      <Navbar />

      {/* Story & Mission Hero */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-bold uppercase tracking-wider mb-6">
          <Target className="w-3.5 h-3.5" /> Our Mission & Story
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-primary tracking-tight mb-8 leading-tight">
          Building AI cybersecurity that empowers every user.
        </h1>
        <p className="text-lg text-secondary font-medium leading-relaxed max-w-3xl mx-auto">
          DetectIQ was built on a simple conviction: detection platforms should not just issue opaque scores. They must explain why a threat is dangerous, learn user-specific context, and teach users how to spot attacks independently.
        </p>
      </section>

      {/* Mission Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-primary mb-3">Multi-Layer Intelligence</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Combining classical ML classifiers, RAG context vectors, threat databases, and LLM reasoning to achieve high precision.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
            <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 text-accent-violet flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-primary mb-3">Human-Centered Security</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Empowering students, professionals, and teams through interactive vulnerability courses and personalized security scores.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-primary mb-3">Privacy & Zero-Trust</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Local QR decoding, client-side image OCR processing, and strict data boundary enforcement across all services.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
