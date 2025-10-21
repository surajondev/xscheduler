"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { axiosInstance } from "@/lib/axiosInstance";
import { Bell, Settings, Twitter } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDashboard } from "../context/DashboardContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { isConnected, setIsConnected, twitterUsername, setTwitterUsername } =
    useDashboard();
  const [isConnectSheetOpen, setIsConnectSheetOpen] = useState(false);
  const [twitterToken, setTwitterToken] = useState({
    access_token: "",
    consumer_key: "",
    consumer_secret: "",
    token_secret: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [socialAccountId, setSocialAccountId] = useState<string | null>(null);

  const [twitterSchedulerId, setTwitterSchedulerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedSocialId = localStorage.getItem("social_account_id");
    const storedTwitterSchedulerId = localStorage.getItem(
      "twitter_scheduler_id",
    );
    console.log(storedUserId, storedSocialId, storedTwitterSchedulerId);

    setUserId(storedUserId);
    setSocialAccountId(storedSocialId);
    setTwitterSchedulerId(storedTwitterSchedulerId);
  }, []);

  const handleConnectTwitter = async () => {
    if (twitterUsername && twitterToken) {
      try {
        const payload = {
          ...twitterToken,
          username: twitterUsername,
        };

        let res;
        if (isConnected && twitterSchedulerId) {
          const url = `/social_accounts/${socialAccountId}/twitter_scheduler/${twitterSchedulerId}`;
          res = await axiosInstance.patch(url, payload);
        } else {
          const url = `/social_accounts/${socialAccountId}/twitter_scheduler`;
          res = await axiosInstance.post(url, payload);
          if (res.data.id) {
            setTwitterSchedulerId(res.data.id);
            localStorage.setItem("twitter_scheduler_id", res.data.id);
          }
        }

        toast.success("Twitter Integrated Sucessfully");
        setIsConnected(true);
        setIsConnectSheetOpen(false);
      } catch (error: any) {
        toast.error(error.error || "Unable to connect");
      }
    }
  };

  const fetchConnect = async () => {
    try {
      const res = await axiosInstance.get(
        `/social_accounts/${socialAccountId}/twitter_scheduler`,
      );
      if (res?.data?.username) {
        setIsConnected(true);
        setTwitterUsername(res?.data?.username);
        setTwitterToken(res?.data?.token);
        localStorage.setItem("twitter_scheduler_id", res.data.id);
        setTwitterSchedulerId(res.data.id);
      }
    } catch (error: any) {
      toast.error(error.error || "Unable to connect");
    }
  };

  useEffect(() => {
    if (userId && socialAccountId) {
      fetchConnect();
    }
  }, [userId]);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                TS
              </span>
            </div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              Twitter Scheduler Pro
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Sheet open={isConnectSheetOpen} onOpenChange={setIsConnectSheetOpen}>
            <SheetTrigger asChild>
              <Button variant={isConnected ? "secondary" : "outline"} size="sm">
                <Twitter className="h-4 w-4 mr-2" />
                {isConnected ? "Connected" : "Connect Twitter"}
              </Button>
            </SheetTrigger>
            <SheetContent className="px-4 w-[500px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-primary" />
                  Connect Twitter Account
                </SheetTitle>
                <SheetDescription>
                  Enter your Twitter credentials to start scheduling and
                  managing your tweets.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Twitter Username</Label>
                  <Input
                    id="username"
                    placeholder="@yourusername"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your Twitter username without the @ symbol
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Consumer Key</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Enter your Twitter Consumer Key"
                    value={twitterToken?.consumer_key}
                    onChange={(e) =>
                      setTwitterToken({
                        ...twitterToken,
                        consumer_key: e.target.value,
                      })
                    }
                  />
                  <Label htmlFor="token">Consumer Secret</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Enter your Twitter Secret"
                    value={twitterToken?.consumer_secret}
                    onChange={(e) =>
                      setTwitterToken({
                        ...twitterToken,
                        consumer_secret: e.target.value,
                      })
                    }
                  />
                  <Label htmlFor="token">Access Token</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Enter your Twitter Acess Token"
                    value={twitterToken?.access_token}
                    onChange={(e) =>
                      setTwitterToken({
                        ...twitterToken,
                        access_token: e.target.value,
                      })
                    }
                  />
                  <Label htmlFor="token">Token Secret</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Enter your Twitter Token Secret"
                    value={twitterToken?.token_secret}
                    onChange={(e) =>
                      setTwitterToken({
                        ...twitterToken,
                        token_secret: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    You can get this from your Twitter Developer Portal
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">
                    How to get your API token:
                  </h4>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Go to developer.twitter.com</li>
                    <li>Create a new app or select existing one</li>
                    <li>Navigate to "Keys and tokens"</li>
                    <li>Generate a Bearer Token</li>
                    <li>Copy and paste it above</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleConnectTwitter}
                    disabled={!twitterUsername || !twitterToken}
                    className="flex-1"
                  >
                    Connect Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsConnectSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/register">Log Out</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
