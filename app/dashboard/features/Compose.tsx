import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  Video,
  Smile,
  Hash,
  AtSign,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDashboard } from "../context/DashboardContext";

export default function Compose({
  tweetText,
  setTweetText,
  threads,
  setThreads,
  scheduledDate,
  setScheduledDate,
  scheduledHour,
  setScheduledHour,
  handleSchedule,
  handleNow,
  characterLimit,
  drawer,
  handleDrawer,
  isConnected,
  twitterUsername,
}: {
  tweetText: string;
  setTweetText: (value: string) => void;
  threads: string[];
  setThreads: (value: string[]) => void;

  scheduledDate: Date | undefined;
  setScheduledDate: (value: Date | undefined) => void;
  scheduledHour: string;
  setScheduledHour: (value: string) => void;
  handleSchedule: () => void;
  handleNow: () => void;
  characterLimit: number;
  drawer: any;
  handleDrawer: (key: string, value: boolean) => void;
  isConnected: boolean;
  twitterUsername: string;
}) {
  const { attachments, setAttachments } = useDashboard();
  const handleThreadChange = (index: number, value: string) => {
    const newThreads = [...threads];
    newThreads[index] = value;
    setThreads(newThreads);
  };

  const addThread = () => {
    setThreads([...threads, ""]);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        setAttachments([...attachments, file]);
        toast.success("Image added successfully!");
      }
    }
  };

  return (
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
          {isConnected ? `Connected: @${twitterUsername}` : "Not Connected"}
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
              onPaste={handlePaste}
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

          {threads.map((thread, index) => (
            <div key={index} className="space-y-2">
              <Textarea
                placeholder="Add to your thread..."
                value={thread}
                onChange={(e) => handleThreadChange(index, e.target.value)}
                className="min-h-[80px] resize-none text-base"
                maxLength={characterLimit}
              />
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addThread}>
              <Plus className="h-4 w-4 mr-2" />
              Add to thread
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attachments</label>
            <Input type="file" multiple onChange={handleAttachmentChange} />
            {attachments.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`attachment-${index}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Date</label>
                <Popover
                  open={drawer?.calendar}
                  onOpenChange={() =>
                    handleDrawer("calendar", !drawer?.calendar)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground",
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
                      onSelect={(val) => {
                        setScheduledDate(val);
                        handleDrawer("calendar", !drawer?.calendar);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Time</label>
                <Select value={scheduledHour} onValueChange={setScheduledHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                      return (
                        <SelectItem key={hour} value={hour}>
                          {`${hour}:00`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
  );
}
