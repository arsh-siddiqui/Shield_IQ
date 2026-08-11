import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ActiveLesson from "../components/learn/ActiveLesson";
import { useAppData } from "../context/AppDataContext";
import { learningPaths } from "../data/dummyData";
import { getLessons, getQuickLearns, getSafetyTips, getLessonById } from "../services/learnService";

export default function Learn() {
  const location = useLocation();
  const { user, learningProgress, inProgressLessons, startLessonProgress, xp, simulationResults } = useAppData();
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeLessonData, setActiveLessonData] = useState(null);
  const [activeQuickLearn, setActiveQuickLearn] = useState(null);
  const [qlSelection, setQlSelection] = useState(null);

  const [lessonsMap, setLessonsMap] = useState({});
  const [quickLearns, setQuickLearns] = useState([]);
  const [safetyTips, setSafetyTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const [lessonsData, qlData, stData] = await Promise.all([
          getLessons(),
          getQuickLearns(),
          getSafetyTips()
        ]);
        
        const lMap = {};
        lessonsData.forEach(l => lMap[l.slug] = l);
        
        setLessonsMap(lMap);
        setQuickLearns(qlData);
        setSafetyTips(stData);
      } catch (err) {
        console.error("Failed to load Learn content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const level = Math.max(1, Math.floor(xp / 300) + 1);
  const totalLessons = Object.keys(lessonsMap).length || 25;
  const progressPercent = Math.round((learningProgress.size / totalLessons) * 100) || 0;

  const startLesson = async (id) => {
    try {
      const lesson = await getLessonById(id);
      if (lesson) {
        await startLessonProgress(id);
        setActiveLessonData(lesson);
        setActiveLessonId(id);
      }
    } catch (err) {
      alert("Failed to load lesson content.");
    }
  };

  const closeLesson = () => {
    setActiveLessonId(null);
    setActiveLessonData(null);
  };

  // Handle Scanner -> Learn contextual navigation
  useEffect(() => {
    if (location.state?.openLessonId && !isLoading && !activeLessonId) {
      startLesson(location.state.openLessonId);
    }
  }, [location.state, isLoading]);

  // Start vs Continue Learning Recommendation Logic
  const recommendation = useMemo(() => {
    if (Object.keys(lessonsMap).length === 0) return null;

    const inProgArr = Array.from(inProgressLessons);
    if (inProgArr.length > 0 && lessonsMap[inProgArr[0]]) {
      return { type: "continue", id: inProgArr[0] };
    }
    
    if (learningProgress.size > 0) {
      for (const path of learningPaths) {
        for (const lId of path.lessons) {
          if (!learningProgress.has(lId) && lessonsMap[lId]) {
            return { type: "next", id: lId };
          }
        }
      }
    }
    
    const firstLessonId = learningPaths[0]?.lessons[0];
    if (firstLessonId && lessonsMap[firstLessonId]) {
      return { type: "start", id: firstLessonId };
    }
    return null;
  }, [inProgressLessons, learningProgress, lessonsMap]);

  // Real Data Achievement Badges
  const achievements = useMemo(() => {
    const isFirstStep = learningProgress.size >= 1;
    const isPhishingDefender = ["ph-1", "ph-2", "ph-3", "ph-4", "ph-5"].every((id) => learningProgress.has(id));
    const isScamSpotter = (learningProgress.size + Object.keys(simulationResults || {}).length) >= 5;
    const isSevenDayStreak = (user?.streakDays || 0) >= 7;
    const isCyberSmart = learningProgress.size >= 10;

    return [
      { id: "first_step", label: "First Step", desc: "Complete your 1st lesson", icon: "BookOpen", earned: isFirstStep },
      { id: "phish_def", label: "Phishing Defender", desc: "Complete all Phishing lessons", icon: "ShieldCheck", earned: isPhishingDefender },
      { id: "scam_spotter", label: "Scam Spotter", desc: "Complete 5 lessons or simulations", icon: "Gamepad2", earned: isScamSpotter },
      { id: "streak_7", label: "7-Day Streak", desc: "Reach a 7-day streak", icon: "Flame", earned: isSevenDayStreak },
      { id: "cyber_smart", label: "Cyber Smart", desc: "Complete 10 cybersecurity lessons", icon: "Award", earned: isCyberSmart },
    ];
  }, [learningProgress, simulationResults, user]);

  if (activeLessonId && activeLessonData) {
    return (
      <AppLayout>
        <ActiveLesson 
          lesson={activeLessonData} 
          steps={activeLessonData.steps || {}} 
          onBack={closeLesson} 
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-ink mb-2">ShieldIQ Learn</h1>
            <p className="text-base text-ink-light max-w-2xl">
              Structured cybersecurity training paths. Learn concepts, see real examples, spot warning signs, and practice in real scenarios.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="primary" icon={Icons.BookOpen}>
              {learningProgress.size} / {totalLessons} Lessons Completed
            </Badge>
          </div>
        </div>
      </div>

      {!isLoading && recommendation && (
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Hero Card */}
          <div className="col-span-1 lg:col-span-2">
            <Card className="p-8 bg-gradient-to-br from-primary-50 to-white h-full flex flex-col justify-between border border-primary/20 relative overflow-hidden shadow-soft">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Icons.BookOpen className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary mb-2 block">
                  {recommendation.type === "start" ? "Start Your Learning Journey" : "Continue Learning"}
                </span>
                <h2 className="text-2xl font-extrabold text-ink mb-1">
                  {lessonsMap[recommendation.id]?.title || "Next Lesson"}
                </h2>
                <p className="text-ink-light text-sm mb-6 leading-relaxed max-w-xl">
                  {lessonsMap[recommendation.id]?.description || "Begin your cybersecurity training path."}
                </p>
              </div>
              
              <div className="relative z-10 flex items-center gap-4">
                <Button size="lg" onClick={() => startLesson(recommendation.id)} className="shadow-lg shadow-primary/30">
                  {recommendation.type === "start" ? "Start Lesson 1" : "Continue Lesson"} <Icons.ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Overall Progress & Streak */}
          <div className="col-span-1">
            <Card className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-ink flex items-center gap-2">
                    <Icons.Target className="w-5 h-5 text-primary" />
                    Overall Progress
                  </h3>
                  <div className="bg-primary-50 px-3 py-1 rounded-full text-xs font-bold text-primary">
                    Level {level}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-semibold text-ink-light mb-2">
                    <span>Curriculum Mastery</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progressPercent}%` }} 
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Icons.Flame className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900">Daily Learning Streak</div>
                    <div className="text-sm font-extrabold text-amber-950">{user?.streakDays || 0} Days Active</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Achievements Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Award className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-ink">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((ach) => {
            const Icon = Icons[ach.icon] || Icons.Award;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  ach.earned
                    ? "bg-white border-primary-200 shadow-soft"
                    : "bg-slate-50/60 border-slate-200 opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                    ach.earned ? "bg-primary-50 text-primary" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-ink mb-1">{ach.label}</div>
                <div className="text-[10px] text-ink-faint leading-snug">{ach.desc}</div>
                <div className="mt-2">
                  <Badge tone={ach.earned ? "success" : "neutral"} className="text-[9px]">
                    {ach.earned ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore Topics Header & Difficulty Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold text-ink">Training Modules</h3>
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
          {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDifficulty === diff
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {learningPaths.map((path) => {
          const Icon = Icons[path.icon] || Icons.BookOpen;
          
          const validLessons = path.lessons.filter(id => lessonsMap[id]);
          const pathLessons = validLessons.length;
          if (pathLessons === 0) return null;

          // Difficulty filtering check
          const filteredLessons = validLessons.filter((id) => {
            if (selectedDifficulty === "All") return true;
            return lessonsMap[id]?.difficulty === selectedDifficulty;
          });

          if (filteredLessons.length === 0) return null;

          const completed = validLessons.filter(id => learningProgress.has(id)).length;
          const pathProgress = Math.round((completed / pathLessons) * 100) || 0;

          return (
            <Card key={path.id} className="p-6 hover:shadow-soft transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-base">{path.title}</h4>
                    <p className="text-xs text-ink-light mt-1 leading-relaxed">{path.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs font-semibold text-ink-light mb-2">
                  <span>{completed} of {pathLessons} completed</span>
                  <span>{pathProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pathProgress}%` }} />
                </div>

                <div className="space-y-2">
                  {filteredLessons.map(lessonId => {
                    const l = lessonsMap[lessonId];
                    if (!l) return null;
                    const isCompleted = learningProgress.has(lessonId);
                    const isStarted = inProgressLessons.has(lessonId);
                    return (
                      <button 
                        key={lessonId}
                        onClick={() => startLesson(lessonId)}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isCompleted ? (
                            <Icons.CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                          ) : isStarted ? (
                            <Icons.Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          ) : (
                            <Icons.Circle className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                          )}
                          <span className={`text-sm truncate ${isCompleted ? 'text-ink-light line-through decoration-slate-300' : 'text-ink font-semibold'}`}>
                            {l.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-ink-faint">
                            {l.difficulty || "Beginner"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Learn & Safety Tips */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Quick Learn */}
        {!isLoading && quickLearns.length > 0 && (
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Icons.Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-ink">Interactive Quick Practice</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {quickLearns.map(ql => (
                <button 
                  key={ql._id || ql.title}
                  onClick={() => { setActiveQuickLearn(ql); setQlSelection(null); }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-primary hover:shadow-soft transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-ink group-hover:text-primary transition-colors text-sm">{ql.title}</h4>
                    <Icons.ChevronRight className="w-4 h-4 text-ink-light group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-ink-light line-clamp-2 leading-relaxed">{ql.explanation}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Safety Tips */}
        {!isLoading && safetyTips.length > 0 && (
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Icons.ShieldAlert className="w-5 h-5 text-secondary" />
              <h3 className="text-xl font-bold text-ink">Quick Safety Tips</h3>
            </div>
            <div className="space-y-3">
              {safetyTips.map((tip, i) => (
                <Card key={i} className="p-4 border-l-4 border-l-secondary hover:shadow-soft transition-all">
                  <h5 className="font-bold text-ink mb-1 text-sm">{tip.title}</h5>
                  <p className="text-xs text-ink-light leading-relaxed">{tip.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
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
              <div className="p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-start">
                <div>
                  <div className="text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">Interactive Challenge</div>
                  <h3 className="text-xl font-bold text-ink">{activeQuickLearn.title}</h3>
                </div>
                <button onClick={() => setActiveQuickLearn(null)} className="p-2 text-ink-light hover:text-ink hover:bg-white rounded-full transition-colors">
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-ink-light mb-6 text-sm leading-relaxed">{activeQuickLearn.explanation}</p>
                
                <div className="space-y-3">
                  {activeQuickLearn.options.map(opt => {
                    const isSelected = qlSelection?.id === opt.id;
                    const isCorrect = opt.isSuspicious === false;
                    const isActuallyCorrect = opt.correct !== undefined ? opt.correct : isCorrect;
                    
                    return (
                      <button
                        key={opt.id}
                        onClick={() => { if (!qlSelection) setQlSelection(opt); }}
                        disabled={!!qlSelection}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                          qlSelection
                            ? isSelected 
                              ? isActuallyCorrect ? 'border-success bg-success-50 text-success-800' : 'border-danger bg-danger-50 text-danger-800'
                              : 'border-slate-100 bg-slate-50 text-ink-faint'
                            : 'border-slate-200 bg-white hover:border-primary text-ink'
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
                      <div className={`p-4 rounded-xl text-sm font-medium ${qlSelection.correct !== undefined ? (qlSelection.correct ? 'bg-success-50 text-success-900' : 'bg-warning-50 text-warning-900') : (qlSelection.isSuspicious ? 'bg-success-50 text-success-900' : 'bg-warning-50 text-warning-900')}`}>
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
