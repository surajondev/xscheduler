import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { DashboardProvider } from "./context/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
