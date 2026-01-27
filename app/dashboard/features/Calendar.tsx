import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarProps {
  posts: any[];
}

export default function Calendar({ posts = [] }: CalendarProps) {
  console.log("Calendar received posts:", posts);
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth); // 0 = Sunday, 1 = Monday, etc.

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Content Calendar
        </h2>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center font-medium">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday} className="ml-2">
            Today
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Content</CardTitle>
          <CardDescription>
            View and manage your scheduled posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px border-b border-border pb-4 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: startingDayIndex }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[100px] bg-muted/10 rounded-md"
              />
            ))}

            {daysInMonth.map((day, i) => {
              const dayPosts = posts.filter((post: any) => {
                const postDate = new Date(post.scheduledAt);
                const isSame = isSameDay(postDate, day);
                // Only log if we find a match or periodically to avoid spam
                if (isSame)
                  console.log("Match found for day:", day, "Post:", post);
                return isSame;
              });
              const hasPost = dayPosts.length > 0;

              return (
                <div
                  key={i}
                  className={`
                        min-h-[100px] p-2 border border-border rounded-md flex flex-col gap-1 transition-colors
                        ${
                          isToday(day)
                            ? "bg-primary/5 border-primary"
                            : "bg-card hover:bg-accent/5"
                        }
                      `}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full ${
                        isToday(day)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {hasPost && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] scrollbar-thin scrollbar-thumb-border">
                    {dayPosts.map((post: any, idx: number) => (
                      <div
                        key={idx}
                        className="text-[10px] truncate bg-muted p-1 rounded border border-border/50 text-muted-foreground"
                        title={post.content}
                      >
                        {post.content}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
