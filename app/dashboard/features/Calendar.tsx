import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Calendar() {
  return (
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
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
  );
}
