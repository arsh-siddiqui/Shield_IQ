import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressRing from "../components/ui/ProgressRing";
import {
  quickActions,
  learningPaths,
  lessons,
} from "../data/dummyData";
import DailyChallengeCard from "../components/learn/DailyChallengeCard";
import { riskTone, colorText, colorBg50 } from "../utils/colorMaps";
import { useAppData } from "../context/AppDataContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, xp, scanHistory, learningProgress, simulationResults, quizResults } = useAppData();

  // Calculate real category progress from authenticated completed lessons
  const realLearningProgress = learningPaths
    .map((path) => {
      const completedCount = path.lessons.filter((id) => learningProgress.has(id)).length;
      const totalCount = path.lessons.length;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return {
        id: path.id,
        category: path.title,
        completedCount,
        totalCount,
        progress: progressPercent,
      };
    })
    .filter((p) => p.progress > 0);

  const totalLessonsCompleted = learningProgress.size;
  const level = Math.max(1, Math.floor(xp / 300) + 1);
  const xpIntoLevel = xp % 300;
  const xpPercent = Math.round((xpIntoLevel / 300) * 100);

  // Calculated Real Security Stats
  const totalScansCount = scanHistory.length;
  const safeScansCount = scanHistory.filter((s) => (s.risk || "").toString().toLowerCase().includes("safe")).length;
  const highRiskScansCount = scanHistory.filter((s) => (s.risk || "").toString().toLowerCase().includes("high")).length;

  // Find next suggested lesson for "Continue Learning"
  let nextLesson = null;
  for (const path of learningPaths) {
    for (const lessonId of path.lessons) {
      if (!learningProgress.has(lessonId)) {
        nextLesson = { id: lessonId, meta: lessons[lessonId], category: path.title };
        break;
      }
    }
    if (nextLesson) break;
  }

  const firstName = user.name ? user.name.split(" ")[0] : "User";

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Good to see you, {firstName} 👋</h1>
          <p className="text-sm text-ink-light mt-1">Here's your personal cybersecurity status snapshot.</p>
        </div>
        <Badge tone="accent" icon={Icons.Flame}>
          {user.streakDays || 0}-day streak
        </Badge>
      </div>

      {/* Today's Level Goal */}
      <Card className="p-6 mb-6 flex flex-col sm:flex-row items-center gap-6 shadow-softer">
        <ProgressRing progress={xpPercent} size={80} color="#2563EB" />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-ink text-base">Level {level} Safety Goal</h3>
          <p className="text-sm text-ink-light mt-1 leading-relaxed">
            {xpIntoLevel} / 300 XP to Level {level + 1} — scan messages and complete lessons to level up.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/learn")}>
          Keep Learning
        </Button>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((qa, i) => {
          const Icon = Icons[qa.icon] || Icons.Zap;
          return (
            <motion.button
              key={qa.label}
              onClick={() => navigate(qa.to, qa.tab ? { state: { tab: qa.tab } } : undefined)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-softer p-5 text-left hover:shadow-soft transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-semibold text-ink">{qa.label}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Scans */}
        <Card className="lg:col-span-2 p-6 flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">Recent Scans</h3>
            <button onClick={() => navigate("/scanner")} className="text-xs font-semibold text-primary hover:underline">
              Scan new →
            </button>
          </div>

          {totalScansCount > 0 ? (
            <div className="divide-y divide-slate-100 flex-1">
              {scanHistory.slice(0, 5).map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => navigate("/scan-result", { state: { result: scan.result || scan, target: scan.target } })}
                  className="w-full flex items-center gap-4 py-3 text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${
                      colorBg50[riskTone[scan.risk || scan.riskLevel]] || "bg-slate-50"
                    } flex items-center justify-center flex-shrink-0`}
                  >
                    <Icons.FileSearch
                      className={`w-4 h-4 ${colorText[riskTone[scan.risk || scan.riskLevel]] || "text-slate-400"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink truncate">{scan.target || "Scanned Content"}</div>
                    <div className="text-xs text-ink-faint">
                      {scan.type || "URL"} · {scan.time || "Recent"}
                    </div>
                  </div>
                  <Badge tone={riskTone[scan.risk || scan.riskLevel] || "neutral"}>{scan.risk || scan.riskLevel}</Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Icons.Search className="w-6 h-6 text-slate-300" />
              </div>
              <h4 className="font-semibold text-ink mb-1">No scans yet</h4>
              <p className="text-xs text-ink-light max-w-[250px] mb-4">
                Scan a suspicious message, URL, or email to see your results here.
              </p>
              <Button size="sm" onClick={() => navigate("/scanner")} icon={Icons.ScanLine}>
                Scan Something
              </Button>
            </div>
          )}
        </Card>

        {/* Right Column: Learning Card & Security Overview */}
        <div className="space-y-6 flex flex-col">
          {/* Start Learning / Continue Learning */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink">
                {totalLessonsCompleted === 0 ? "Start Learning" : "Continue Learning"}
              </h3>
              <button onClick={() => navigate("/learn")} className="text-xs font-semibold text-primary hover:underline">
                Explore →
              </button>
            </div>

            {totalLessonsCompleted === 0 ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center mb-3">
                  <Icons.BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-ink mb-1">Begin your cybersecurity journey</h4>
                <p className="text-xs text-ink-light leading-relaxed mb-4">
                  Complete interactive micro-lessons to spot phishing, UPI fraud, and fake job scams.
                </p>
                <Button size="sm" onClick={() => navigate("/learn")}>
                  Start Learning
                </Button>
              </div>
            ) : (
              <div>
                {nextLesson && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                      Up Next · {nextLesson.category}
                    </div>
                    <div className="text-sm font-semibold text-ink mb-1">{nextLesson.meta?.title || "Next Lesson"}</div>
                    <p className="text-xs text-ink-light line-clamp-2">{nextLesson.meta?.description}</p>
                  </div>
                )}

                {realLearningProgress.length > 0 && (
                  <div className="space-y-3">
                    {realLearningProgress.slice(0, 3).map((lp) => (
                      <div key={lp.id}>
                        <div className="flex justify-between text-xs font-semibold text-ink-light mb-1">
                          <span>{lp.category}</span>
                          <span>{lp.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lp.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Security Overview (Calculated from Real Scans) */}
          <Card className="p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink">Security Overview</h3>
              <span className="text-[11px] text-ink-faint">Real Activity</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-ink">{totalScansCount}</div>
                <div className="text-[11px] text-ink-faint mt-0.5">Total Scans</div>
              </div>
              <div className="p-3 rounded-xl bg-green-50/60 border border-green-100">
                <div className="text-xl font-extrabold text-green-700">{safeScansCount}</div>
                <div className="text-[11px] text-green-800 mt-0.5">Safe</div>
              </div>
              <div className="p-3 rounded-xl bg-danger-50/60 border border-danger-100">
                <div className="text-xl font-extrabold text-danger">{highRiskScansCount}</div>
                <div className="text-[11px] text-danger mt-0.5">High Risk</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: AI Assistant CTA & Daily Challenge */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ShieldIQ AI Assistant CTA */}
        <Card className="p-6 bg-gradient-to-br from-primary-50/60 to-white flex flex-col justify-between border-primary/20">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Icons.Sparkles className="w-4 h-4" />
              AI Cybersecurity Advisor
            </div>
            <h3 className="font-extrabold text-ink text-lg mb-2">Have a cybersecurity question?</h3>
            <p className="text-xs text-ink-light leading-relaxed mb-4">
              Ask ShieldIQ AI Assistant about suspicious messages, URLs, UPI requests, or how to stay safe online.
            </p>
          </div>
          <div>
            <Button size="sm" icon={Icons.Bot} onClick={() => navigate("/assistant")}>
              Ask ShieldIQ AI
            </Button>
          </div>
        </Card>

        {/* Daily Challenge */}
        <DailyChallengeCard />
      </div>
    </AppLayout>
  );
}
