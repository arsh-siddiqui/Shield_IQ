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
import { completeLessonRemote } from "../services/learnService";
import { submitSimulationRemote } from "../services/simulationService";

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
    isAdmin: remote.isAdmin,
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
  const [isInitializing, setIsInitializing] = useState(true);
  const updateUser = useCallback((patch) => setUser((u) => ({ ...u, ...patch })), []);

  const [scanHistory, setScanHistory] = useState(initialScans);
  const [learningProgress, setLearningProgress] = useState(() => new Set());
  const [simulationResults, setSimulationResults] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [xp, setXp] = useState(currentUser.xp);

  const loadUserData = useCallback(async (remoteUser) => {
    setUser((u) => mergeRemoteUser(u, remoteUser));
    setIsAuthenticated(true);
    
    // Clear demo data immediately for authenticated users
    setScanHistory([]);
    setLearningProgress(new Set());
    setSimulationResults({});
    setQuizResults({});
    setXp(remoteUser.xp || 0);

    try {
      const apiClient = (await import("../services/apiClient")).default;
      const { data } = await apiClient.get("/users/progress");
      const progressData = data.data;
      
      if (progressData.simulations) {
        const simMap = {};
        progressData.simulations.forEach(s => {
          simMap[s.simulation.slug] = { choiceId: s.choice, correct: s.correct, xp: s.xpAwarded };
        });
        setSimulationResults(simMap);
      }
      if (progressData.lessonProgress) {
        const lpSet = new Set();
        progressData.lessonProgress.forEach(lp => {
          if (lp.status === "completed" && lp.lessonId && lp.lessonId.slug) {
            lpSet.add(lp.lessonId.slug);
          }
        });
        setLearningProgress(lpSet);
      }
      
      if (progressData.quizzes) {
        const qMap = {};
        progressData.quizzes.forEach(q => {
           if (q.lessonId || q.quizId) {
              qMap[q.lessonId || q.quizId] = { correct: q.correctAnswers > 0 || q.score > 0 };
           }
        });
        setQuizResults(qMap);
      }
      
      const { data: scanData } = await apiClient.get("/users/scans");
      if (scanData?.data?.scans) {
        setScanHistory(scanData.data.scans.map(s => ({
          id: s._id,
          type: s.scanType || s.type,
          target: s.target,
          risk: s.riskLevel,
          riskScore: s.riskScore,
          time: new Date(s.createdAt).toLocaleDateString()
        })));
      }
    } catch (err) {
      console.error("Failed to load user progress from backend", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then(async (remoteUser) => {
        if (cancelled) return;
        await loadUserData(remoteUser);
        setIsInitializing(false);
      })
      .catch(() => {
        setIsInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadUserData]);

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
      await loadUserData(remoteUser);
      return { ok: true };
    } catch (err) {
      if (isBackendUnreachable(err)) return { ok: false, offline: true };
      return { ok: false, message: err.response?.data?.message || "Login failed." };
    }
  }, [loadUserData]);

  const register = useCallback(async ({ name, email, password, accountRole }) => {
    try {
      const remoteUser = await registerUser({ name, email, password, accountRole });
      await loadUserData(remoteUser);
      return { ok: true };
    } catch (err) {
      if (isBackendUnreachable(err)) return { ok: false, offline: true };
      return { ok: false, message: err.response?.data?.message || "Registration failed." };
    }
  }, [loadUserData]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      /* backend unreachable — clearing local state below is enough */
    }
    setIsAuthenticated(false);
    setUser(currentUser);
    setScanHistory(initialScans);
    setLearningProgress(new Set());
    setSimulationResults({});
    setQuizResults({});
    setXp(currentUser.xp);
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

  const completeQuiz = useCallback(async (articleId, correct) => {
    try {
      const apiClient = (await import("../services/apiClient")).default;
      await apiClient.post("/quizzes/results", { lessonId: articleId, correct });
    } catch (e) {
      // Backend unavailable or error, fall back to local
    }
    setQuizResults((prev) => ({ ...prev, [articleId]: { correct } }));
    if (correct) setXp((prev) => prev + 20); // +20 XP for quiz
  }, []);

  // ---- ShieldIQ Learn: lessons, challenges, skills -------------------------
  const [skillLevels, setSkillLevels] = useState(initialSkillProgress);
  const [challengeCompletions, setChallengeCompletions] = useState(() => new Set());

  const completeLesson = useCallback(async (lessonId, xpEarned = 30) => {
    try {
      await completeLessonRemote(lessonId);
    } catch (e) {
      // Backend unavailable or error, fall back to local
    }
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

  const completeSimulation = useCallback(async (scenarioId, choiceId) => {
    const scenario = simulationScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return null;
    const outcome = scenario.feedback[choiceId];
    
    try {
      await submitSimulationRemote(scenarioId, choiceId);
    } catch (e) {
      // Backend unavailable or error, fall back to local
    }

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
    isInitializing,
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
