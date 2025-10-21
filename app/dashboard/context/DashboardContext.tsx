"use client";

import { createContext, useContext, useState } from "react";

const DashboardContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  twitterUsername: string;
  setTwitterUsername: (value: string) => void;
  attachments: File[];
  setAttachments: (value: File[]) => void;
}>({
  activeTab: "compose",
  setActiveTab: () => {},
  isConnected: false,
  setIsConnected: () => {},
  twitterUsername: "",
  setTwitterUsername: () => {},
  attachments: [],
  setAttachments: () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("compose");
  const [isConnected, setIsConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isConnected,
        setIsConnected,
        twitterUsername,
        setTwitterUsername,
        attachments,
        setAttachments,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
