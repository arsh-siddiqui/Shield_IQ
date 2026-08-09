import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";
import DesktopTopBar from "./DesktopTopBar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />
        <DesktopTopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
