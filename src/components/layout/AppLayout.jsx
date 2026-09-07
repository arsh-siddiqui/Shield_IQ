import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";
import DesktopTopBar from "./DesktopTopBar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />
        <DesktopTopBar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
