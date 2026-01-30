"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axiosInstance";

export interface SocialAccount {
  id: string;
  name: string;
}

const DashboardContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  twitterUsername: string;
  setTwitterUsername: (value: string) => void;
  attachments: File[];
  setAttachments: (value: File[]) => void;
  accounts: SocialAccount[];
  setAccounts: (value: SocialAccount[]) => void;
  activeAccountId: string | null;
  setActiveAccountId: (value: string | null) => void;
  fetchAccounts: () => Promise<void>;
  switchAccount: (accountId: string) => void;
}>({
  activeTab: "compose",
  setActiveTab: () => {},
  isConnected: false,
  setIsConnected: () => {},
  twitterUsername: "",
  setTwitterUsername: () => {},
  attachments: [],
  setAttachments: () => {},
  accounts: [],
  setAccounts: () => {},
  activeAccountId: null,
  setActiveAccountId: () => {},
  fetchAccounts: async () => {},
  switchAccount: () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("compose");
  const [isConnected, setIsConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      const res = await axiosInstance.get("/social_accounts");
      if (res.data) {
        setAccounts(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    }
  };

  const switchAccount = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (account) {
      setActiveAccountId(account.id);
      setTwitterUsername(account.name);
      setIsConnected(true);
      localStorage.setItem("social_account_id", account.id);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
        accounts,
        setAccounts,
        activeAccountId,
        setActiveAccountId,
        fetchAccounts,
        switchAccount,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
