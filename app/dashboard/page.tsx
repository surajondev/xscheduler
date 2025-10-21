"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";
import moment from "moment";
import Compose from "./features/Compose";
import Schedule from "./features/Schedule";
import Analytics from "./features/Analytics";
import Calendar from "./features/Calendar";
import { useDashboard } from "./context/DashboardContext";

export default function TwitterScheduler() {
  const {
    activeTab,
    isConnected,
    twitterUsername,
    attachments,
    setAttachments,
  } = useDashboard();
  const [tweetText, setTweetText] = useState("");
  const [threads, setThreads] = useState<string[]>([""]);

  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined,
  );
  const [scheduledHour, setScheduledHour] = useState<string>("");
  const [scheduledPosts, setScheduledPosts] = useState<any>([]);
  const characterLimit = 280;
  const [userId, setUserId] = useState<string | null>(null);
  const [socialAccountId, setSocialAccountId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<any>({});

  const handleDrawer = (key: string, value: boolean) => {
    setDrawer({ ...drawer, [key]: value });
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedSocialId = localStorage.getItem("social_account_id");
    console.log(storedUserId, storedSocialId);

    setUserId(storedUserId);
    setSocialAccountId(storedSocialId);
  }, []);

  const fetchTweets = async () => {
    try {
      const res = await axiosInstance.get(
        `/social_accounts/${socialAccountId}/posts`,
      );
      if (res?.data) {
        setScheduledPosts(res?.data);
      }
    } catch (error: any) {
      toast.error(error.error || "Unable to connect");
    }
  };

  const handleSchedule = async () => {
    if (tweetText && scheduledDate && scheduledHour) {
      try {
        const datePart = moment(scheduledDate).format("YYYY-MM-DD");
        const dateTimeString = `${datePart} ${scheduledHour}:00`;

        const scheduledAt = moment(dateTimeString, "YYYY-MM-DD HH:mm").format();

        const attachmentPromises = attachments.map(async (file) => {
          const data = await toBase64(file);
          return {
            type: file.type,
            data,
          };
        });
        const base64Attachments = await Promise.all(attachmentPromises);

        const res = await axiosInstance.post(
          `/social_accounts/${socialAccountId}/posts/schedule`,
          {
            content: tweetText,
            threads,
            attachments: base64Attachments,
            status: "scheduled",
            scheduled_at: scheduledAt,
            user_id: userId,
            social_account_id: socialAccountId,
          },
        );
        toast.success("Tweet Scheduled Successfully");
        setTweetText("");
        setThreads([""]);
        setAttachments([]);
        setScheduledDate(undefined);
        setScheduledHour("");
      } catch (error: any) {
        toast.error(error.error || "Unable to schedule tweet");
      }
    } else {
      toast.error("Please enter tweet content and select a date and time.");
    }
  };

  const handleNow = async () => {
    if (twitterUsername) {
      try {
        const attachmentPromises = attachments.map(async (file) => {
          const data = await toBase64(file);
          return {
            type: file.type,
            data,
          };
        });
        const base64Attachments = await Promise.all(attachmentPromises);

        const res = await axiosInstance.post(
          `/social_accounts/${socialAccountId}/posts/now`,
          {
            content: tweetText,
            threads,
            attachments: base64Attachments,
            status: "posted",
            scheduled_at: null,
            user_id: userId,
            social_account_id: socialAccountId,
          },
        );
        toast.success("Twitter Integrated Sucessfully");
      } catch (error: any) {
        toast.error(error.error || "Unable to connect");
      }
    }
  };

  const analytics = {
    totalTweets: 156,
    totalEngagement: 12400,
    followers: 8900,
    growth: 12.5,
  };

  useEffect(() => {
    if (userId && socialAccountId) {
      fetchTweets();
    }
  }, [userId]);

  return (
    <>
      {activeTab === "compose" && (
        <Compose
          tweetText={tweetText}
          setTweetText={setTweetText}
          threads={threads}
          setThreads={setThreads}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          scheduledHour={scheduledHour}
          setScheduledHour={setScheduledHour}
          handleSchedule={handleSchedule}
          handleNow={handleNow}
          characterLimit={characterLimit}
          drawer={drawer}
          handleDrawer={handleDrawer}
          isConnected={isConnected}
          twitterUsername={twitterUsername}
        />
      )}

      {activeTab === "schedule" && <Schedule scheduledPosts={scheduledPosts} />}

      {activeTab === "analytics" && <Analytics analytics={analytics} />}

      {activeTab === "calendar" && <Calendar />}
    </>
  );
}
