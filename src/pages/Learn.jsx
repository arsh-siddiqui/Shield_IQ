import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ActiveLesson from "../components/learn/ActiveLesson";
import { useAppData } from "../context/AppDataContext";
import { learningPaths, lessons, lessonSteps, recommendations, quickLearns, safetyTips } from "../data/dummyData";

export default function Learn() {
  const { learningProgress, skillLevels, xp } = useAppData();
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeQuickLearn, setActiveQuickLearn] = useState(null);
  const [qlSelection, setQlSelection] = useState(null);

  const level = Math.max(1, Math.floor(xp / 300) + 1);
  const totalLessons = Object.keys(lessons).length;
  const progressPercent = Math.round((learningProgress.size / totalLessons) * 100) || 0;

  const startLesson = (id) => {
    if (lessonSteps[id]) {
      setActiveLessonId(id);
    } else {
      alert("Lesson content coming soon in this demo.");
    }
  };

  if (activeLessonId) {
    const lesson = lessons[activeLessonId];
    const steps = lessonSteps[activeLessonId];
    return (
      <AppLayout>
        <ActiveLesson lesson={lesson} steps={steps} onBack={() => setActiveLessonId(null)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-ink mb-3">ShieldIQ Learn</h1>
        <p className="text-lg text-ink-light max-w-2xl">
          Build practical cybersecurity skills through short lessons, real examples, and interactive practice.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Continue Learning */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-white h-full flex flex-col justify-between border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icons.BookOpen className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">Continue Learning</span>
              <h2 className="text-2xl font-bold text-ink mb-1">Spotting Fake Links</h2>
              <p className="text-ink-light text-sm mb-6">Lesson 3 of 4 · 4 min remaining</p>
              
              <div className="w-full max-w-md bg-white h-2 rounded-full overflow-hidden mb-8 border border-slate-100 shadow-sm">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '40%' }} 
                  className="h-full bg-primary"
                />
              </div>
            </div>
            
            <div className="relative z-10">
              <Button size="lg" onClick={() => startLesson("ph-3")} className="shadow-lg shadow-primary/30">
                Continue Learning
              </Button>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        <div className="col-span-1">
          <Card className="p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-ink flex items-center gap-2">
                <Icons.Target className="w-5 h-5 text-primary" />
                Your Progress
              </h3>
              <div className="bg-primary-50 px-3 py-1 rounded-full text-xs font-bold text-primary">
                Level {level}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm font-semibold text-ink-light mb-2">
                <span>Cyber Safety Mastery</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }} 
                  whileInView={{ width: `${progressPercent}%` }} 
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {/* Recommended */}
            {recommendations.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="font-bold text-ink text-sm mb-1">Recommended for You</h4>
                <p className="text-xs text-ink-light mb-4">{recommendations[0].title}</p>
                <Button size="sm" variant="outline" className="w-full bg-white" onClick={() => startLesson(recommendations[0].lessonId)}>
                  Start Learning
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Learn Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Icons.Zap className="w-6 h-6 text-accent" />
          <h3 className="text-2xl font-bold text-ink">Quick Learn</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {quickLearns.map(ql => (
            <button 
              key={ql.id}
              onClick={() => { setActiveQuickLearn(ql); setQlSelection(null); }}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-accent hover:shadow-soft transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-ink group-hover:text-accent transition-colors">{ql.title}</h4>
                <Icons.ChevronRight className="w-5 h-5 text-ink-light group-hover:text-accent transition-colors" />
              </div>
              <p className="text-sm text-ink-light line-clamp-2">{ql.explanation}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Explore Topics */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-ink mb-6">Explore Topics</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {learningPaths.map((path) => {
              const Icon = Icons[path.icon] || Icons.BookOpen;
              const pathLessons = path.lessons.length;
              const completed = path.lessons.filter(id => learningProgress.has(id)).length;
              const pathProgress = Math.round((completed / pathLessons) * 100) || 0;

              return (
                <Card key={path.id} className="p-6 hover:shadow-soft transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${path.color}-50 text-${path.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink">{path.title}</h4>
                      <p className="text-xs text-ink-light mt-1">{path.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-semibold text-ink-light mb-2">
                    <span>{pathLessons} lessons</span>
                    <span>{pathProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className={`h-full bg-${path.color} rounded-full`} style={{ width: `${pathProgress}%` }} />
                  </div>

                  <div className="space-y-2">
                    {path.lessons.map(lessonId => {
                      const l = lessons[lessonId];
                      if (!l) return null;
                      const isCompleted = learningProgress.has(l.id);
                      return (
                        <button 
                          key={l.id}
                          onClick={() => startLesson(l.id)}
                          className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isCompleted ? (
                              <Icons.CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                            ) : (
                              <Icons.Circle className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                            )}
                            <span className={`text-sm truncate ${isCompleted ? 'text-ink-light' : 'text-ink font-medium'}`}>{l.title}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-ink-faint hidden group-hover:block ml-2">{l.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="col-span-1">
          <h3 className="text-2xl font-bold text-ink mb-6">Quick Safety Tips</h3>
          <div className="space-y-4">
            {safetyTips.map((tip, i) => (
              <Card key={i} className="p-5 border-l-4 border-l-secondary hover:shadow-soft transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <Icons.ShieldAlert className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-ink mb-1 group-hover:text-secondary transition-colors">{tip.title}</h5>
                    <p className="text-sm text-ink-light leading-relaxed">{tip.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Learn Modal */}
      <AnimatePresence>
        {activeQuickLearn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveQuickLearn(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6 bg-accent-50 border-b border-accent/10 flex justify-between items-start">
                <div>
                  <div className="text-accent font-bold text-xs uppercase tracking-wider mb-1">Quick Learn</div>
                  <h3 className="text-xl font-bold text-ink">{activeQuickLearn.title}</h3>
                </div>
                <button onClick={() => setActiveQuickLearn(null)} className="p-2 text-ink-light hover:text-ink hover:bg-white rounded-full transition-colors">
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-ink-light mb-6 font-medium">{activeQuickLearn.explanation}</p>
                
                <div className="space-y-3">
                  {activeQuickLearn.options.map(opt => {
                    const isSelected = qlSelection?.id === opt.id;
                    const isCorrect = opt.isSuspicious; // In these examples, the goal is to spot the suspicious one
                    return (
                      <button
                        key={opt.id}
                        onClick={() => { if (!qlSelection) setQlSelection(opt); }}
                        disabled={!!qlSelection}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all font-semibold ${
                          qlSelection
                            ? isSelected 
                              ? isCorrect ? 'border-success bg-success-50 text-success-800' : 'border-danger bg-danger-50 text-danger-800'
                              : 'border-slate-100 bg-slate-50 text-ink-faint'
                            : 'border-slate-200 bg-white hover:border-accent text-ink'
                        }`}
                      >
                        {opt.text}
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {qlSelection && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6">
                      <div className={`p-4 rounded-xl text-sm font-medium ${qlSelection.isSuspicious ? 'bg-success-50 text-success-900' : 'bg-warning-50 text-warning-900'}`}>
                        {activeQuickLearn.feedback}
                      </div>
                      <Button className="w-full mt-4" onClick={() => setActiveQuickLearn(null)}>Close</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AppLayout>
  );
}
