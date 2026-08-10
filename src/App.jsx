import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppDataProvider, useAppData } from "./context/AppDataContext";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIScanner from "./pages/AIScanner";
import ScanResult from "./pages/ScanResult";
import ScamDecoder from "./pages/ScamDecoder";
import ScamSimulator from "./pages/ScamSimulator";
import AttackReplay from "./pages/AttackReplay";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { Loader2 } from "lucide-react";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAppData();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { user, isAuthenticated } = useAppData();
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  const { isInitializing } = useAppData();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/scanner" element={<AIScanner />} />
      <Route path="/scan-result" element={<ScanResult />} />
      <Route path="/decoder" element={<ScamDecoder />} />
      <Route path="/simulator" element={<ScamSimulator />} />
      <Route path="/attack-replay" element={<AttackReplay />} />
      <Route path="/learn" element={<Learn />} />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AppDataProvider>
  );
}
