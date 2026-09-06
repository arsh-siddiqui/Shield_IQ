import { useState } from "react";
import { User, LogOut, Loader2, Save } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import Button from "../components/ui/Button";

export default function Profile() {
  const { user, updateUser, xp, logout } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [isSaving, setIsSaving] = useState(false);
  
  const level = Math.max(1, Math.floor((xp || 0) / 300) + 1);
  const xpInCurrentLevel = (xp || 0) % 300;
  const progressPercent = Math.round((xpInCurrentLevel / 300) * 100);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Real implementation would call updateUserService here
    setTimeout(() => {
      updateUser(formData);
      setIsEditing(false);
      setIsSaving(false);
    }, 800);
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Your Profile</h1>
          <p className="text-ink-light mt-1">Manage your account and preferences.</p>
        </div>
        <Button variant="outline" className="text-danger border-danger-200 hover:bg-danger-50" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Avatar & Level */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-extrabold mb-4 shadow-lift">
              {user.avatar}
            </div>
            <h2 className="text-xl font-bold text-ink">{user.name}</h2>
            <div className="text-sm font-semibold text-primary mt-1">{user.role}</div>
            
            <div className="w-full mt-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-ink">Level {level}</span>
                <span className="text-xs font-semibold text-ink-light">{xpInCurrentLevel} / 300 XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 text-xs font-medium text-ink-light flex justify-between">
                <span>Member since</span>
                <span className="text-ink">{user.memberSince || "Aug 2026"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </h3>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-light uppercase tracking-wider mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-50 transition-all"
                  />
                ) : (
                  <div className="text-base font-medium text-ink">{user.name}</div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-ink-light uppercase tracking-wider mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-50 transition-all"
                  />
                ) : (
                  <div className="text-base font-medium text-ink">{user.email}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email }); }}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
