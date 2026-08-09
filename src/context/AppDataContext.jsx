import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  currentUser,
  initialNotifications,
  recentScans as initialScans,
  profileBadges,
  simulationScenarios,
  adminUsers as initialAdminUsers,
  adminArticles as initialAdminArticles,
  initialSkillProgress,
} from "../data/dummyData";
import { analyzeContent as analyzeContentLocal } from "../utils/scanEngine";
import { isBackendUnreachable } from "../services/apiClient";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../services/authService";
import { analyzeContentRemote } from "../services/scanService";

const AppDataContext = createContext(null);

let scanIdSeq = 100;
let adminUserIdSeq = 900;
let adminArticleIdSeq = 900;

/** Reshapes the API's user object onto the fields the existing UI already reads. */
function mergeRemoteUser(local, remote) {
  return {
    ...local,
    name: remote.name,
    email: remote.email,
    role: remote.role,
    avatar: remote.avatar,
    xp: remote.xp,
    streakDays: remote.streakDays,
    memberSince: remote.memberSince
      ? new Date(remote.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : local.memberSince,
  };
}

export function AppDataProvider({ children }) {
  // ---- Profile -----------------------------------------------------------
  const [user, setUser] = useState(currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const updateUser = useCallback((patch) => setUser((u) => ({ ...u, ...patch })), []);

  // On mount, silently check for an existing backend session (httpOnly
  // cookie from a previous real login). If the API isn't running or there's
  // no session, this fails quietly and the app stays in local demo mode —
  // exactly the "don't break the app" behavior the backend integration
  // needs to preserve.
  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then((remoteUser) => {
        if (cancelled) return;
        setUser((u) => mergeRemoteUser(u, remoteUser));
        setIsAuthenticated(true);
      })
      .catch(() => {
        /* no session / backend unreachable — stay in demo mode */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Tries the real backend first. Returns a small, consistent result object
   * rather than throwing, so callers (Login/Register pages) can decide how
   * to react without needing their own try/catch around axios.
   *   { ok: true }
   *   { ok: false, offline: true }              — backend unreachable, caller should fall back to demo flow
   *   { ok: false, message: "Invalid password" } — real error from the API
   */
  const login = useCallback(async (email, password) => {
    try {
      const remoteUser = await loginUser({ email, password });
      setUser((u) => mergeRemoteUser(u, remoteUser));
      setIsAuthenticated(true);
      return { ok: true };
    } catch (err) {
      if (isBackendUnreachable(err)) return { ok: false, offline: true };
      return { ok: false, message: err.response?.data?.message || "Login failed." };
    }
  }, []);

  const register = useCallback(async ({ name, email, password, accountRole }) => {
    try {
      const remoteUser = await registerUser({ name, email, password, accountRole });
      setUser((u) => mergeRemoteUser(u, remoteUser));
      setIsAuthenticated(true);
      return { ok: true };
    } catch (err) {
      if (isBackendUnreachable(err)) return { ok: false, offline: true };
      return { ok: false, message: err.response?.data?.message || "Registration failed." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      /* backend unreachable — clearing local state below is enough */
    }
    setIsAuthenticated(false);
  }, []);

  // ---- Notification bell ---------------------------------------------------
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ---- Scan history --------------------------------------------------------
  const [scanHistory, setScanHistory] = useState(initialScans);
  const addScan = useCallback((scan) => {
    scanIdSeq += 1;
    setScanHistory((prev) => [{ id: scanIdSeq, time: "Just now", ...scan }, ...prev].slice(0, 20));
  }, []);

  /**
   * Runs a scan through the real backend when it's reachable (which also
   * saves it to server-side history for a logged-in session), falling back
   * to the identical local heuristic in scanEngine.js otherwise. Either way
   * the caller gets the same result shape.
   */
  const runScan = useCallback(async (content, scanType) => {
    try {
      return await analyzeContentRemote(content, scanType);
    } catch (err) {
      return analyzeContentLocal(content, scanType);
    }
  }, []);

  // ---- Awareness Hub: bookmarks, likes, quiz + read progress ---------------
  const [bookmarks, setBookmarks] = useState(() => new Set());
  const toggleBookmark = useCallback((articleId) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(articleId) ? next.delete(articleId) : next.add(articleId);
      return next;
    });
  }, []);

  const [likes, setLikes] = useState(() => new Set());
  const toggleLike = useCallback((articleId) => {
    setLikes((prev) => {
      const next = new Set(prev);
      next.has(articleId) ? next.delete(articleId) : next.add(articleId);
      return next;
    });
  }, []);

  const [readArticles, setReadArticles] = useState(() => new Set());
  const markArticleRead = useCallback((articleId) => {
    setReadArticles((prev) => new Set(prev).add(articleId));
  }, []);

  const [quizResults, setQuizResults] = useState({}); // { [articleId]: { correct: bool } }
  const completeQuiz = useCallback((articleId, correct) => {
    setQuizResults((prev) => ({ ...prev, [articleId]: { correct } }));
    if (correct) setXp((prev) => prev + 20); // +20 XP for quiz
  }, []);

  // ---- ShieldIQ Learn: lessons, challenges, skills -------------------------
  const [learningProgress, setLearningProgress] = useState(() => new Set());
  const [skillLevels, setSkillLevels] = useState(initialSkillProgress);
  const [challengeCompletions, setChallengeCompletions] = useState(() => new Set());

  const completeLesson = useCallback((lessonId, xpEarned = 30) => {
    setLearningProgress((prev) => new Set(prev).add(lessonId));
    setXp((prev) => prev + xpEarned);
  }, []);

  const updateSkill = useCallback((skillName, amount) => {
    setSkillLevels((prev) => ({
      ...prev,
      [skillName]: Math.min(100, (prev[skillName] || 0) + amount)
    }));
  }, []);

  const completeChallenge = useCallback((challengeId, xpEarned = 10) => {
    setChallengeCompletions((prev) => new Set(prev).add(challengeId));
    setXp((prev) => prev + xpEarned);
  }, []);

  // ---- Scam Simulator progress + XP ----------------------------------------
  const [simulationResults, setSimulationResults] = useState({}); // { [scenarioId]: { choiceId, correct, xp } }
  const [xp, setXp] = useState(currentUser.xp);

  const completeSimulation = useCallback((scenarioId, choiceId) => {
    const scenario = simulationScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return null;
    const outcome = scenario.feedback[choiceId];
    setSimulationResults((prev) => ({ ...prev, [scenarioId]: { choiceId, ...outcome } }));
    setXp((prev) => prev + outcome.xp);
    return outcome;
  }, []);

  const simulationsCompletedCount = Object.keys(simulationResults).length;
  const allSimulationsComplete = simulationsCompletedCount >= simulationScenarios.length;

  // ---- Badges (derived, but exposed as stateful-looking earned flags) ------
  const badges = useMemo(() => {
    return profileBadges.map((b) => {
      if (b.name === "First Scan") return { ...b, earned: scanHistory.length > 0 };
      if (b.name === "Simulation Pro") return { ...b, earned: allSimulationsComplete };
      if (b.name === "Quiz Master") return { ...b, earned: Object.values(quizResults).filter((r) => r.correct).length >= 3 };
      if (b.name === "Community Guardian") return { ...b, earned: bookmarks.size >= 3 };
      return b;
    });
  }, [scanHistory.length, allSimulationsComplete, quizResults, bookmarks.size]);

  // ---- Admin CRUD ------------------------------------------------------------
  const [adminUsersState, setAdminUsersState] = useState(initialAdminUsers);
  const addAdminUser = useCallback((u) => {
    adminUserIdSeq += 1;
    setAdminUsersState((prev) => [{ id: adminUserIdSeq, status: "Active", joined: "Aug 2026", ...u }, ...prev]);
  }, []);
  const updateAdminUser = useCallback((id, patch) => {
    setAdminUsersState((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);
  const deleteAdminUser = useCallback((id) => {
    setAdminUsersState((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const [adminArticlesState, setAdminArticlesState] = useState(initialAdminArticles);
  const addAdminArticle = useCallback((a) => {
    adminArticleIdSeq += 1;
    setAdminArticlesState((prev) => [{ id: adminArticleIdSeq, status: "Draft", views: "0", ...a }, ...prev]);
  }, []);
  const updateAdminArticle = useCallback((id, patch) => {
    setAdminArticlesState((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);
  const deleteAdminArticle = useCallback((id) => {
    setAdminArticlesState((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const value = {
    user,
    updateUser,
    isAuthenticated,
    login,
    register,
    logout,
    xp,
    runScan,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    scanHistory,
    addScan,
    bookmarks,
    toggleBookmark,
    likes,
    toggleLike,
    readArticles,
    markArticleRead,
    quizResults,
    completeQuiz,
    simulationResults,
    completeSimulation,
    simulationsCompletedCount,
    allSimulationsComplete,
    badges,
    adminUsersState,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    adminArticlesState,
    addAdminArticle,
    updateAdminArticle,
    deleteAdminArticle,
    learningProgress,
    skillLevels,
    challengeCompletions,
    completeLesson,
    updateSkill,
    completeChallenge,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within an AppDataProvider");
  return ctx;
}
