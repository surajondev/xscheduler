"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  PenTool,
  Settings,
  Bell,
  Plus,
  Clock,
  TrendingUp,
  Heart,
  MessageCircle,
  Repeat2,
  MoreHorizontal,
  ImageIcon,
  Video,
  Smile,
  Hash,
  AtSign,
  MapPin,
  Twitter,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";
import moment from "moment";

export default function TwitterScheduler() {
  const [activeTab, setActiveTab] = useState("compose");
  const [tweetText, setTweetText] = useState("");
  const [isConnectSheetOpen, setIsConnectSheetOpen] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [twitterToken, setTwitterToken] = useState({
    access_token: "",
    consumer_key: "",
    consumer_secret: "",
    token_secret: "",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<any>("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<any>([]);
  const characterLimit = 280;
  const [userId, setUserId] = useState<string | null>(null);
  const [socialAccountId, setSocialAccountId] = useState<string | null>(null);

  useEffect(() => {
    // Runs only on client
    const storedUserId = localStorage.getItem("user_id");
    const storedSocialId = localStorage.getItem("social_account_id");

    setUserId(storedUserId);
    setSocialAccountId(storedSocialId);
  }, []);

  const handleConnectTwitter = async () => {
    if (twitterUsername && twitterToken) {
      try {
        const res = await axiosInstance.post(
          `/social_accounts/${socialAccountId}/twitter_scheduler`,
          {
            ...twitterToken,
            username: twitterUsername,
          }
        );
        toast.success("Twitter Integrated Sucessfully");
        setIsConnected(true);
        setIsConnectSheetOpen(false);
      } catch (error: any) {
        toast.error(error.error || "Unable to connect");
      }
      // Here you would typically make an API call to verify and store the credentials
    }
  };

  const fetchConnect = async () => {
    try {
      const res = await axiosInstance.get(
        `/social_accounts/${socialAccountId}/twitter_scheduler`
      );
      if (res?.data?.username) {
        setIsConnected(true);
        setTwitterUsername(res?.data?.username);
        setTwitterToken(res?.data?.token);
      }
    } catch (error: any) {
      toast.error(error.error || "Unable to connect");
    }
    // Here you would typically make an API call to verify and store the credentials
  };

  const fetchTweets = async () => {
    try {
      const res = await axiosInstance.get(
        `/social_accounts/${socialAccountId}/posts`
      );
      if (res?.data) {
        setScheduledPosts(res?.data);
      }
    } catch (error: any) {
      toast.error(error.error || "Unable to connect");
    }
    // Here you would typically make an API call to verify and store the credentials
  };

  const handleSchedule = async () => {
    if (twitterUsername && tweetText) {
      try {
        // Combine the date and time strings
        const dateTimeString = `${scheduledDate} ${scheduledTime}`;

        // Use moment to parse and format the date and time
        const scheduledAt = moment(dateTimeString, "YYYY-MM-DD HH:mm").format(
          "YYYY-MM-DD HH:mm:ss"
        );

        const res = await axiosInstance.post(
          `/social_accounts/${socialAccountId}/posts/schedule`,
          {
            content: tweetText,
            status: "scheduled",
            scheduled_at: scheduledAt,
            user_id: userId,
            social_account_id: socialAccountId,
          }
        );
        toast.success("Tweet Scheduled Successfully");
        // Clear the form after successful scheduling
        setTweetText("");
        setScheduledDate("");
        setScheduledTime("");
      } catch (error: any) {
        toast.error(error.error || "Unable to schedule tweet");
      }
    } else {
      toast.error("Please enter tweet content and select a date/time.");
    }
  };

  const handleNow = async () => {
    if (twitterUsername) {
      try {
        const res = await axiosInstance.post(
          `/social_accounts/${socialAccountId}/posts/now`,
          {
            content: tweetText,
            status: "posted",
            scheduled_at: null,
            user_id: userId,
            social_account_id: socialAccountId,
          }
        );
        toast.success("Twitter Integrated Sucessfully");
        setIsConnected(true);
        setIsConnectSheetOpen(false);
      } catch (error: any) {
        toast.error(error.error || "Unable to connect");
      }
      // Here you would typically make an API call to verify and store the credentials
    }
  };

  const analytics = {
    totalTweets: 156,
    totalEngagement: 12400,
    followers: 8900,
    growth: 12.5,
  };

  useEffect(() => {
    fetchConnect();
    fetchTweets();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Sheet
              open={isConnectSheetOpen}
              onOpenChange={setIsConnectSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant={isConnected ? "secondary" : "outline"}
                  size="sm"
                >
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
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
              <Calendar className="h-4 w-4" />
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "compose" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Compose Tweet
                </h2>
                <Badge
                  variant={isConnected ? "default" : "secondary"}
                  className={
                    isConnected
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }
                >
                  {isConnected
                    ? `Connected: @${twitterUsername}`
                    : "Not Connected"}
                </Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create New Post</CardTitle>
                  <CardDescription>
                    Compose your tweet and schedule it for the perfect time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="What's happening?"
                      value={tweetText}
                      onChange={(e) => setTweetText(e.target.value)}
                      className="min-h-[120px] resize-none text-base"
                      maxLength={characterLimit}
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Hash className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <AtSign className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            tweetText.length > characterLimit * 0.9
                              ? "text-destructive"
                              : ""
                          }
                        >
                          {tweetText.length}/{characterLimit}
                        </span>
                        <Progress
                          value={(tweetText.length / characterLimit) * 100}
                          className="w-16 h-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Schedule Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !scheduledDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduledDate ? (
                                <span>
                                  {moment(scheduledDate).format("DD-MM-YYYY")}
                                </span>
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={scheduledDate}
                              onSelect={setScheduledDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Schedule Time
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          placeholder="HH"
                          value={scheduledTime.split(":")[0]}
                          onChange={(e) => {
                            const hours = e.target.value.padStart(2, "0");
                            setScheduledTime(
                              `${hours}:${scheduledTime.split(":")[1]}`
                            );
                          }}
                          className="w-1/2 text-center"
                        />
                        <span>:</span>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="MM"
                          value={scheduledTime.split(":")[1]}
                          onChange={(e) => {
                            const minutes = e.target.value.padStart(2, "0");
                            setScheduledTime(
                              `${scheduledTime.split(":")[0]}:${minutes}`
                            );
                          }}
                          className="w-1/2 text-center"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        disabled={!isConnected}
                        onClick={handleSchedule}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Tweet
                      </Button>
                      <Button
                        onClick={handleNow}
                        variant="outline"
                        disabled={!isConnected}
                      >
                        Post Now
                      </Button>
                    </div>
                    {!isConnected && (
                      <p className="text-xs text-muted-foreground text-center">
                        Connect your Twitter account to start scheduling tweets
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Scheduled Posts
                </h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
              <div className="grid gap-4">
                {scheduledPosts.map((post: any) => (
                  <Card key={post?.id}>
                    <CardContent className="px-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <p className="text-foreground leading-relaxed">
                            {post?.content || "No Content"}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {moment(post?.scheduledAt).format(
                                "DD-MM-YY hh:mm"
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {post.status}
                            </Badge>
                          </div>
                          {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.engagement.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Repeat2 className="h-3 w-3" />
                              {post.engagement.retweets}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.engagement.replies}
                            </div>
                          </div> */}
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Analytics Dashboard
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Tweets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {analytics.totalTweets}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {analytics.totalEngagement.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8.2% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Followers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {analytics.followers.toLocaleString()}
                    </div>
                    <p className="text-xs text-accent">
                      +{analytics.growth}% growth
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg. Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      4.2%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +0.3% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Trends</CardTitle>
                    <CardDescription>
                      Your engagement over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <TrendingUp className="h-8 w-8 mr-2" />
                      Chart visualization would go here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>
                      Your most engaging tweets this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-foreground">
                        Just launched our new feature! 🚀 Excited to see...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>❤️ 234</span>
                        <span>🔄 89</span>
                        <span>💬 45</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm text-foreground">
                        Behind the scenes look at our development process...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>❤️ 189</span>
                        <span>🔄 67</span>
                        <span>💬 32</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Content Calendar
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline">This Week</Button>
                  <Button variant="outline">This Month</Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>December 2024</CardTitle>
                  <CardDescription>
                    View and manage your scheduled content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="p-2 text-center text-sm font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6 + 1;
                      const hasPost = [15, 16, 21, 28].includes(day);
                      return (
                        <div
                          key={i}
                          className={`
                            min-h-[80px] p-2 border border-border rounded-md
                            ${
                              day > 0 && day <= 31
                                ? "bg-card hover:bg-accent/10 cursor-pointer"
                                : "bg-muted/30"
                            }
                            ${hasPost ? "border-primary" : ""}
                          `}
                        >
                          {day > 0 && day <= 31 && (
                            <>
                              <div className="text-sm font-medium text-foreground">
                                {day}
                              </div>
                              {hasPost && (
                                <div className="mt-1">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
