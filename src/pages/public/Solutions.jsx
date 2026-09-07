import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Solutions() {
  const useCases = [
    {
      title: "For Individuals & Households",
      icon: ShieldCheck,
      badge: "Personal Security",
      desc: "Stop phishing, fake delivery links, and scam emails before clicking.",
      points: ["Real-time link check", "Email header analysis", "QR code verification"]
    },
    {
      title: "For Students & Educators",
      icon: GraduationCap,
      badge: "Academic & Learning",
      desc: "Learn cybersecurity concepts with hands-on vulnerability modules and quizzes.",
      points: ["7-step vulnerability guide", "Personalized learning profile", "Security posture score"]
    },
    {
      title: "For Businesses & Teams",
      icon: Building2,
      badge: "Enterprise Protection",
      desc: "Protect company inboxes and employee communications with RAG email pattern baselines.",
      points: ["Personalized RAG email baselines", "VirusTotal threat intel", "Custom vulnerability training"]
    }
  ];

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent-blue/30">
      <Navbar />

      <section className="pt-20 pb-12 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider mb-6">
          Tailored Use Cases
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-primary tracking-tight mb-6">
          Solutions for every security need.
        </h1>
        <p className="text-lg text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
          Whether you want to verify a suspicious text message or train your team on web application security, DetectIQ provides dedicated workflows.
        </p>
      </section>

      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <div key={i} className="bg-card rounded-3xl p-8 shadow-card border border-border/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                    <uc.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full">
                    {uc.badge}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-heading text-primary mb-3">{uc.title}</h2>
                <p className="text-sm text-secondary leading-relaxed mb-6">{uc.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {uc.points.map((pt, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-xs font-semibold text-primary">
                      <ShieldCheck className="w-4 h-4 text-accent-blue" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full py-3.5 bg-secondary hover:bg-accent-blue hover:text-white text-primary font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
