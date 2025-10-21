import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";

export default function Analytics({
  analytics,
}: {
  analytics: {
    totalTweets: number;
    totalEngagement: number;
    followers: number;
    growth: number;
  };
}) {
  return (
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
            <p className="text-xs text-muted-foreground">+12 from last month</p>
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
            <p className="text-xs text-accent">+{analytics.growth}% growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.2%</div>
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
  );
}
