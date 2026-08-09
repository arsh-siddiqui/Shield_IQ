import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ProgressRing from "../components/ui/ProgressRing";
import Modal from "../components/ui/Modal";
import { simulationScenarios } from "../data/dummyData";
import { riskTone } from "../utils/colorMaps";
import { useAppData } from "../context/AppDataContext";
import { useToast } from "../context/ToastContext";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "scans", label: "Scan History" },
  { id: "simulations", label: "Simulations" },
  { id: "settings", label: "Settings" },
];

export default function Profile() {
  const [tab, setTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const { user, updateUser, xp, scanHistory, simulationResults, simulationsCompletedCount, badges } = useAppData();
  const { toast } = useToast();

  const level = Math.max(1, Math.floor(xp / 300) + 1);
  const xpPercent = Math.round(((xp % 300) / 300) * 100);

  const [editValues, setEditValues] = useState({ name: user.name, email: user.email, role: user.role });
  const [notifEnabled, setNotifEnabled] = useState(true);

  const openEdit = () => {
    setEditValues({ name: user.name, email: user.email, role: user.role });
    setEditOpen(true);
  };

  const saveEdit = () => {
    updateUser(editValues);
    setEditOpen(false);
    toast("Profile updated.", "success");
  };

  const saveSettings = () => {
    updateUser({ name: editValues.name, email: editValues.email });
    toast("Settings saved.", "success");
  };

  const earnedBadgeCount = badges.filter((b) => b.earned).length;

  return (
    <AppLayout>
      <Card className="p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-extrabold">
              {user.avatar}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
              Lv {level}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-extrabold text-ink">{user.name}</h1>
              <button onClick={openEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-ink-faint" aria-label="Edit profile">
                <Icons.Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-ink-light">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <Badge tone="primary">{user.role}</Badge>
              <Badge tone="neutral" icon={Icons.Calendar}>Member since {user.memberSince}</Badge>
              <Badge tone="accent" icon={Icons.Flame}>{user.streakDays}-day streak</Badge>
            </div>
          </div>
          <ProgressRing progress={xpPercent} size={72} label={`${xpPercent}%`} />
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto mb-6 border-b border-slate-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.id ? "text-primary" : "text-ink-light hover:text-ink"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <Icons.Award className="w-4 h-4 text-accent" />
              Badges
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {badges.map((b) => {
                const Icon = Icons[b.icon] || Icons.Award;
                return (
                  <div key={b.name} className="flex flex-col items-center text-center">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-colors ${
                        b.earned ? "bg-accent-50 text-accent-600" : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-medium ${b.earned ? "text-ink" : "text-ink-faint"}`}>{b.name}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <Icons.TrendingUp className="w-4 h-4 text-primary" />
              This Month
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-primary">{scanHistory.length}</div>
                <div className="text-xs text-ink-light mt-1">Scans</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-secondary">{simulationsCompletedCount}</div>
                <div className="text-xs text-ink-light mt-1">Simulations</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-accent-600">{xp}</div>
                <div className="text-xs text-ink-light mt-1">XP Earned</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-ink">{earnedBadgeCount}</div>
                <div className="text-xs text-ink-light mt-1">Badges</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "scans" && (
        <Card className="p-6">
          {scanHistory.length === 0 ? (
            <p className="text-sm text-ink-light text-center py-8">No scans yet — try the AI Scanner.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {scanHistory.map((scan) => (
                <div key={scan.id} className="flex items-center gap-4 py-3">
                  <Icons.FileSearch className="w-4 h-4 text-ink-faint flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink truncate">{scan.target}</div>
                    <div className="text-xs text-ink-faint">{scan.type} · {scan.time}</div>
                  </div>
                  <Badge tone={riskTone[scan.risk]}>{scan.risk}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "simulations" && (
        <Card className="p-6">
          {simulationsCompletedCount === 0 ? (
            <p className="text-sm text-ink-light text-center py-8">No simulations completed yet — try the Scam Simulator.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {Object.entries(simulationResults).map(([id, result]) => {
                const scenario = simulationScenarios.find((s) => s.id === id);
                return (
                  <div key={id} className="flex items-center gap-4 py-3">
                    <Icons.Gamepad2 className="w-4 h-4 text-ink-faint flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink">{scenario?.label || id}</div>
                      <div className="text-xs text-ink-faint">+{result.xp} XP</div>
                    </div>
                    <Badge tone={result.correct ? "success" : "accent"}>{result.correct ? "Correct" : "Retry Later"}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {tab === "settings" && (
        <Card className="p-6 max-w-lg">
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={editValues.name}
              onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={editValues.email}
              onChange={(e) => setEditValues((v) => ({ ...v, email: e.target.value }))}
            />
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-semibold text-ink">Email notifications</div>
                <div className="text-xs text-ink-faint">Get notified about new threats and tips</div>
              </div>
              <button
                onClick={() => setNotifEnabled((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifEnabled ? "bg-primary" : "bg-slate-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <Button className="mt-2" onClick={saveSettings}>Save Changes</Button>
          </div>
        </Card>
      )}

      {/* Edit profile modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editValues.name}
            onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={editValues.email}
            onChange={(e) => setEditValues((v) => ({ ...v, email: e.target.value }))}
          />
          <div>
            <span className="block text-sm font-medium text-ink mb-1.5">Role</span>
            <div className="grid grid-cols-3 gap-2">
              {["Student", "Professional", "Business"].map((r) => (
                <button
                  key={r}
                  onClick={() => setEditValues((v) => ({ ...v, role: r }))}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                    editValues.role === r ? "border-primary bg-primary-50 text-primary" : "border-slate-200 text-ink-light"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full mt-2" onClick={saveEdit}>Save Profile</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
