import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppDataProvider, useAppData } from "./context/AppDataContext";
import { ToastProvider } from "./context/ToastContext";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Assistant from "./pages/Assistant";

// Detection
import Scan from "./pages/detection/Scan";
import ScanHistory from "./pages/detection/ScanHistory";
import ScanResult from "./pages/detection/ScanResult";

// Security
import MyEmailPatterns from "./pages/detection/MyEmailPatterns";
import SecurityProfile from "./pages/security/SecurityProfile";

// Learning
import VulnerabilityList from "./pages/learning/VulnerabilityList";
import VulnerabilityDetail from "./pages/learning/VulnerabilityDetail";
import Assessment from "./pages/learning/Assessment";
import MyProgress from "./pages/learning/MyProgress";

import Features from "./pages/public/Features";
import About from "./pages/public/About";
import Solutions from "./pages/public/Solutions";
import Resources from "./pages/public/Resources";

import { Loader2 } from "lucide-react";
import AppLayout from "./components/layout/AppLayout";

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

// Wrapper for pages that require the standard app layout with sidebar/navbar
function AppLayoutWrapper({ children }) {
  return <AppLayout>{children}</AppLayout>;
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
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected App Routes */}
      <Route path="/dashboard" element={<RequireAuth><AppLayoutWrapper><Dashboard /></AppLayoutWrapper></RequireAuth>} />
      
      {/* Detection */}
      <Route path="/detection/scanner" element={<RequireAuth><AppLayoutWrapper><Scan /></AppLayoutWrapper></RequireAuth>} />
      <Route path="/detection/history" element={<RequireAuth><AppLayoutWrapper><ScanHistory /></AppLayoutWrapper></RequireAuth>} />
      <Route path="/detection/result/:id" element={<RequireAuth><AppLayoutWrapper><ScanResult /></AppLayoutWrapper></RequireAuth>} />
      <Route path="/detection/email-context" element={<RequireAuth><AppLayoutWrapper><MyEmailPatterns /></AppLayoutWrapper></RequireAuth>} />
      
      {/* Security */}
      <Route path="/security/profile" element={<RequireAuth><AppLayoutWrapper><SecurityProfile /></AppLayoutWrapper></RequireAuth>} />

      {/* Learning */}
      <Route path="/vulnerabilities" element={<RequireAuth><AppLayoutWrapper><VulnerabilityList /></AppLayoutWrapper></RequireAuth>} />
      <Route path="/vulnerabilities/:slug" element={<RequireAuth><AppLayoutWrapper><VulnerabilityDetail /></AppLayoutWrapper></RequireAuth>} />
      <Route path="/vulnerabilities/:slug/assessment" element={<RequireAuth><AppLayoutWrapper><Assessment /></AppLayoutWrapper></RequireAuth>} />
      <Route path="/learning/progress" element={<RequireAuth><AppLayoutWrapper><MyProgress /></AppLayoutWrapper></RequireAuth>} />
      
      <Route path="/assistant" element={<RequireAuth><Assistant /></RequireAuth>} />
      
      <Route path="/profile" element={<RequireAuth><AppLayoutWrapper><Profile /></AppLayoutWrapper></RequireAuth>} />
      
      <Route path="/admin" element={<RequireAdmin><AppLayoutWrapper><AdminDashboard /></AppLayoutWrapper></RequireAdmin>} />
      
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
