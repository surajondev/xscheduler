import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, MoreHorizontal } from "lucide-react";
import moment from "moment";

export default function Schedule({
  scheduledPosts,
}: {
  scheduledPosts: any[];
}) {
  return (
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
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-foreground leading-relaxed">
                    {post?.content || "No Content"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {moment(post?.scheduled_at).format("DD-MM-YY hh:mm A")}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {post.status}
                    </Badge>
                  </div>
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
  );
}
