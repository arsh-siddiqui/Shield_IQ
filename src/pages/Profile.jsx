import { useState, useEffect } from "react";
import { User, LogOut, Loader2, Save, Shield, Key, Smartphone, Bell, Activity, CheckCircle2 } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { updateProfileRemote } from "../services/userService";
import { getScanHistory } from "../services/detectionService";
import Button from "../components/ui/Button";

export default function Profile() {
  const { user, updateUser, xp, logout } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [isSaving, setIsSaving] = useState(false);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securitySummaries, setSecuritySummaries] = useState(false);
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    getScanHistory().then(scans => {
      setRecentScans((scans || []).slice(0, 3));
    }).catch(() => setRecentScans([]));
  }, []);
  
  const level = Math.max(1, Math.floor((xp || 0) / 300) + 1);
  const xpInCurrentLevel = (xp || 0) % 300;
  const progressPercent = Math.round((xpInCurrentLevel / 300) * 100);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateProfileRemote(formData);
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      // In a real app we'd show a toast here
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-accent-blue/10 text-accent-blue shadow-sm border border-accent-blue/20">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tight mb-2">Account Settings</h1>
            <p className="text-secondary font-medium text-lg">Manage your personal information, security preferences, and active sessions.</p>
          </div>
        </div>
        <button 
          className="bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:-translate-y-0.5 hover:shadow-card transition-all text-sm inline-flex items-center justify-center gap-2" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Avatar & Level */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-elevated flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-accent-blue/10 to-transparent pointer-events-none" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent-blue/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-accent-blue/30 transition-colors duration-700" />
            
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet text-white flex items-center justify-center text-5xl font-heading font-black mb-6 shadow-soft relative z-10 border-[6px] border-card ring-4 ring-background">
              {user.avatar}
            </div>
            <h2 className="text-3xl font-heading font-black text-primary relative z-10 mb-2">{user.name}</h2>
            <div className="text-[10px] font-bold text-accent-blue relative z-10 bg-accent-blue/10 border border-accent-blue/20 px-4 py-1.5 rounded-lg uppercase tracking-wider">{user.role}</div>
            
            <div className="w-full mt-10 pt-8 border-t border-border relative z-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-base font-bold text-primary">Level {level}</span>
                <span className="text-xs font-bold text-secondary bg-background px-3 py-1.5 rounded-lg shadow-sm border border-border">{xpInCurrentLevel} / 300 XP</span>
              </div>
              <div className="w-full bg-background border border-border rounded-full h-3 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-accent-blue to-accent-violet h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-8 text-xs font-medium text-secondary flex justify-between items-center bg-background border border-border p-5 rounded-2xl shadow-sm">
                <span>Member since</span>
                <span className="text-primary font-bold">{user.memberSince || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-elevated">
            <h3 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-accent-blue" /> Recent Activity
            </h3>
            <div className="space-y-6">
              {recentScans.length > 0 ? recentScans.map(scan => (
                <div key={scan._id} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    scan.riskLevel === 'high' || scan.riskLevel === 'critical' ? 'bg-danger/10 text-danger' :
                    scan.riskLevel === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm font-bold text-primary mb-1 truncate max-w-[200px]">{scan.target}</div>
                    <div className="text-xs text-secondary font-medium capitalize">{scan.scanType} Scan • {scan.riskLevel} Risk</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-muted mt-2">
                      {new Date(scan.createdAt).toLocaleDateString()} at {new Date(scan.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-secondary font-medium">No recent activity found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Personal Info */}
          <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 relative z-10">
              <h3 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                Personal Information
              </h3>
              {!isEditing && (
                <button 
                  className="bg-background border border-border text-primary px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors text-sm shadow-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-bold text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all shadow-inner"
                  />
                ) : (
                  <div className="text-sm font-bold text-primary bg-background px-5 py-4 rounded-xl border border-border shadow-sm">{user.name}</div>
                )}
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-bold text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all shadow-inner"
                  />
                ) : (
                  <div className="text-sm font-bold text-primary bg-background px-5 py-4 rounded-xl border border-border shadow-sm">{user.email}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-border relative z-10">
                <button 
                  className="bg-background border border-border text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-secondary transition-colors text-sm shadow-sm"
                  onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email }); }}
                >
                  Cancel
                </button>
                <button 
                  className="bg-gradient-to-r from-accent-blue to-accent-violet text-white px-8 py-3.5 rounded-xl font-bold shadow-soft hover:opacity-95 hover:-translate-y-0.5 transition-all text-sm inline-flex items-center gap-2 disabled:opacity-50"
                  onClick={handleSave} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Account Security */}
          <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              Account Security
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-background rounded-2xl border border-border hover:border-border/80 transition-colors shadow-sm">
                <div>
                  <div className="font-bold text-primary mb-1.5 flex items-center gap-2 text-base">
                    <Key className="w-4 h-4 text-secondary" /> Password
                  </div>
                  <div className="text-sm text-secondary font-medium">Last changed 3 months ago</div>
                </div>
                <button className="bg-card border border-border text-primary px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors text-sm shadow-sm">
                  Change Password
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-background rounded-2xl border border-border hover:border-border/80 transition-colors shadow-sm">
                <div>
                  <div className="font-bold text-primary mb-1.5 flex items-center gap-2 text-base">
                    <Smartphone className="w-4 h-4 text-secondary" /> Two-Factor Authentication
                  </div>
                  <div className="text-sm text-secondary font-medium">Add an extra layer of security to your account.</div>
                </div>
                <button 
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${twoFactorEnabled ? 'bg-success' : 'bg-secondary'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1.5'}`} />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-background rounded-2xl border border-border hover:border-border/80 transition-colors shadow-sm">
                <div>
                  <div className="font-bold text-primary mb-1.5 text-base">Connected Accounts</div>
                  <div className="text-sm text-secondary font-medium">Sign in using Google or Github.</div>
                </div>
                <button className="bg-card border border-border text-primary px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors text-sm shadow-sm">
                  Manage Connections
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-card rounded-[2rem] p-8 sm:p-10 border border-border shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-2xl font-heading font-extrabold text-primary flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center shadow-sm">
                <Bell className="w-6 h-6" />
              </div>
              Notification Preferences
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-6 p-6 bg-background rounded-2xl border border-border hover:border-border/80 transition-colors shadow-sm">
                <div>
                  <div className="font-bold text-primary mb-1.5 text-base">Security Alerts via Email</div>
                  <div className="text-sm text-secondary font-medium">Get notified immediately about high-risk scans.</div>
                </div>
                <button 
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${emailAlerts ? 'bg-success' : 'bg-secondary'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${emailAlerts ? 'translate-x-6' : 'translate-x-1.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-6 p-6 bg-background rounded-2xl border border-border hover:border-border/80 transition-colors shadow-sm">
                <div>
                  <div className="font-bold text-primary mb-1.5 text-base">Weekly Security Summary</div>
                  <div className="text-sm text-secondary font-medium">Receive a weekly digest of your learning progress.</div>
                </div>
                <button 
                  onClick={() => setSecuritySummaries(!securitySummaries)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${securitySummaries ? 'bg-success' : 'bg-secondary'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${securitySummaries ? 'translate-x-6' : 'translate-x-1.5'}`} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
