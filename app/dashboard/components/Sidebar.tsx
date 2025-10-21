"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar as CalendarIcon,
  Clock,
  PenTool,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export default function Sidebar() {
  const { activeTab, setActiveTab } = useDashboard();
  return (
    <aside className="w-64 border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        <Button
          variant={activeTab === "compose" ? "default" : "ghost"}
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("compose")}
        >
          <PenTool className="h-4 w-4" />
          Compose
        </Button>
        <Button
          variant={activeTab === "schedule" ? "default" : "ghost"}
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("schedule")}
        >
          <CalendarIcon className="h-4 w-4" />
          Schedule
        </Button>
        <Button
          variant={activeTab === "analytics" ? "default" : "ghost"}
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
        <Button
          variant={activeTab === "calendar" ? "default" : "ghost"}
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("calendar")}
        >
          <Clock className="h-4 w-4" />
          Content Calendar
        </Button>
      </nav>
    </aside>
  );
}
