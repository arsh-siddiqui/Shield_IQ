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
  threatAlerts,
  dailyTip,
} from "../data/dummyData";
import DailyChallengeCard from "../components/learn/DailyChallengeCard";
import { riskTone, colorText, colorBg50 } from "../utils/colorMaps";
import { useAppData } from "../context/AppDataContext";
import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, xp, scanHistory, learningProgress } = useAppData();

  const realLearningProgress = learningPaths
    .map((path) => {
      const completed = path.lessons.filter((id) => learningProgress.has(id)).length;
      const progressPercent = path.lessons.length > 0 ? Math.round((completed / path.lessons.length) * 100) : 0;
      return { category: path.title, progress: progressPercent };
    })
    .filter((p) => p.progress > 0);

  const level = Math.max(1, Math.floor(xp / 300) + 1);
  const xpIntoLevel = xp % 300;
  const xpPercent = Math.round((xpIntoLevel / 300) * 100);

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Good to see you, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-ink-light mt-1">Here's your safety snapshot for today.</p>
        </div>
        <Badge tone="accent" icon={Icons.Flame}>{user.streakDays}-day streak</Badge>
      </div>

      {/* Today's Goal */}
      <Card className="p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing progress={xpPercent} size={80} color="#2563EB" />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-ink">Today's Goal: Reach Level {level + 1}</h3>
          <p className="text-sm text-ink-light mt-1">
            {xpIntoLevel} / 300 XP — keep scanning and learning to level up.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/learn")}>Keep Learning</Button>
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
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">Recent Scans</h3>
            <button onClick={() => navigate("/scanner")} className="text-xs font-semibold text-primary hover:underline">
              Scan new →
            </button>
          </div>
          {scanHistory.length > 0 ? (
            <div className="divide-y divide-slate-100 flex-1">
              {scanHistory.slice(0, 5).map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => navigate("/scan-result", { state: { result: scan.result, target: scan.target } })}
                  className="w-full flex items-center gap-4 py-3 text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl ${colorBg50[riskTone[scan.risk]] || "bg-slate-50"} flex items-center justify-center flex-shrink-0`}>
                    <Icons.FileSearch className={`w-4 h-4 ${colorText[riskTone[scan.risk]] || "text-slate-400"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink truncate">{scan.target}</div>
                    <div className="text-xs text-ink-faint">{scan.type} · {scan.time}</div>
                  </div>
                  <Badge tone={riskTone[scan.risk] || "neutral"}>{scan.risk}</Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Icons.Search className="w-6 h-6 text-slate-300" />
              </div>
              <h4 className="font-semibold text-ink mb-1">No scans yet</h4>
              <p className="text-sm text-ink-light max-w-[250px]">Scan a suspicious message or link to see your results here.</p>
            </div>
          )}
        </Card>

        <div className="space-y-6 flex flex-col">
          {/* Learning Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink">Learning Progress</h3>
              {realLearningProgress.length === 0 && (
                <button onClick={() => navigate("/learn")} className="text-xs font-semibold text-primary hover:underline">
                  Start →
                </button>
              )}
            </div>
            {realLearningProgress.length > 0 ? (
              <div className="space-y-4">
                {realLearningProgress.slice(0, 4).map((lp) => (
                  <div key={lp.category}>
                    <div className="flex justify-between text-xs font-semibold text-ink-light mb-1.5">
                      <span>{lp.category}</span>
                      <span>{lp.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lp.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                  <Icons.BookOpen className="w-5 h-5 text-slate-300" />
                </div>
                <h4 className="text-sm font-semibold text-ink mb-1">Start learning</h4>
                <p className="text-xs text-ink-light max-w-[200px] mx-auto">Complete your first lesson to track your progress.</p>
              </div>
            )}
          </Card>

          {/* Threat Alerts */}
          <Card className="p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Icons.ShieldAlert className="w-4 h-4 text-danger" />
              <h3 className="font-bold text-ink">Threat Alerts</h3>
            </div>
            <div className="space-y-1">
              {threatAlerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => toast(`Marked "${alert.title}" as reviewed.`, "success")}
                  className="w-full flex items-start gap-3 text-left py-2 -mx-2 px-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === "High" ? "bg-danger" : "bg-accent"}`} />
                  <div>
                    <div className="text-sm text-ink leading-snug">{alert.title}</div>
                    <div className="text-xs text-ink-faint mt-1">{alert.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Tip */}
        <Card className="p-6 bg-gradient-to-br from-secondary-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Icons.Lightbulb className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-ink">Today's Tip</h3>
          </div>
          <h4 className="font-semibold text-ink text-sm mb-2">{dailyTip.title}</h4>
          <p className="text-sm text-ink-light leading-relaxed">{dailyTip.body}</p>
        </Card>

        {/* Today's Challenge */}
        <DailyChallengeCard />
      </div>
    </AppLayout>
  );
}
