import { Link } from "react-router-dom";
import { BookOpen, FileText, Download, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Resources() {
  const articles = [
    {
      title: "Anatomy of a Modern Phishing Campaign",
      category: "Threat Analysis",
      date: "Sept 2026",
      desc: "How attackers use lookalike domains, urgency cues, and hidden redirects to deceive victims."
    },
    {
      title: "Understanding RAG Baselines in Email Detection",
      category: "AI & ML Architecture",
      date: "Aug 2026",
      desc: "Why traditional static blacklists fail and how vector similarity matching reduces false alarms."
    },
    {
      title: "QR Code Security Handbook (Quishing Prevention)",
      category: "Mobile Security",
      date: "Aug 2026",
      desc: "Best practices for scanning and decoding QR codes safely on iOS and Android devices."
    }
  ];

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent-blue/30">
      <Navbar />

      <section className="pt-20 pb-12 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-bold uppercase tracking-wider mb-6">
          <BookOpen className="w-3.5 h-3.5" /> Resource Library & Reports
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-primary tracking-tight mb-6">
          Cybersecurity Insights & Intelligence
        </h1>
        <p className="text-lg text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
          Explore research reports, threat analysis guides, and developer handbooks created by the DetectIQ team.
        </p>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, i) => (
            <div key={i} className="bg-card rounded-3xl p-8 shadow-card border border-border/40 flex flex-col justify-between hover:-translate-y-1 transition-all">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-muted mb-4">
                  <span className="text-accent-blue font-bold uppercase">{art.category}</span>
                  <span>{art.date}</span>
                </div>
                <h2 className="text-xl font-bold font-heading text-primary mb-3 leading-snug">{art.title}</h2>
                <p className="text-sm text-secondary leading-relaxed mb-6">{art.desc}</p>
              </div>

              <Link to="/vulnerabilities" className="inline-flex items-center gap-2 text-xs font-bold text-accent-blue hover:underline">
                Read Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
