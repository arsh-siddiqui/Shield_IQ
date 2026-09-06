import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isBackendUnreachable } from "../services/apiClient";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../services/authService";

const AppDataContext = createContext(null);

const defaultGuestUser = {
  name: "Guest",
  email: "",
  role: "Student",
  avatar: "G",
  memberSince: "",
  isAdmin: false,
};

function mergeRemoteUser(local, remote) {
  return {
    ...local,
    name: remote.name,
    email: remote.email,
    role: remote.role,
    isAdmin: remote.isAdmin,
    avatar: remote.avatar || (remote.name ? remote.name.substring(0, 2).toUpperCase() : "U"),
    learningProfile: remote.learningProfile || {}, // Extract learning profile
    memberSince: remote.memberSince
      ? new Date(remote.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : local.memberSince,
  };
}

export function AppDataProvider({ children }) {
  const [user, setUser] = useState(defaultGuestUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [xp, setXp] = useState(0);

  const updateUser = useCallback((patch) => setUser((u) => ({ ...u, ...patch })), []);

  const loadUserData = useCallback(async (remoteUser) => {
    const mergedUser = mergeRemoteUser(user, remoteUser);
    setUser(mergedUser);
    setIsAuthenticated(true);
    setXp(mergedUser.learningProfile?.xp || 0);
  }, [user]);

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
      // Backend unreachable, clearing local state is enough
    }
    setIsAuthenticated(false);
    setUser(defaultGuestUser);
    setXp(0);
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
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within an AppDataProvider");
  return ctx;
}
