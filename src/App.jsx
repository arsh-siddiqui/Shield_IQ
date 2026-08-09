import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
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

export default function App() {
  return (
    <AppDataProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<AIScanner />} />
            <Route path="/scan-result" element={<ScanResult />} />
            <Route path="/decoder" element={<ScamDecoder />} />
            <Route path="/simulator" element={<ScamSimulator />} />
            <Route path="/attack-replay" element={<AttackReplay />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppDataProvider>
  );
}
