'use client'

import { Message } from "@/model/Message";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Switch } from "@/components/shadcn/switch";
import { Separator } from "@/components/shadcn/separator";
import { Button } from "@/components/shadcn/button";
import { MessageCard } from "@/components/my/MessageCard";
import { Loader2, RefreshCcw, Copy, Link as LinkIcon, Inbox } from "lucide-react";
import { Card } from "@/components/shadcn/card";
import Link from "next/link";
import * as z from "zod";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => String(message._id) !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false
    }
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessage');

  // FETCH MESSAGE ACCEPTANCE STATUS
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      const resData = res.data as any;
      setValue('acceptMessage', resData.data?.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message acceptance status"
      );
    } finally {
      setIsSwitchLoading(false);  
    }
  }, [setValue]);

  // FETCH MESSAGES ACTUAL
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/get-messages");
      const resData = res.data as any;
      setMessages(resData.data?.messages || []);

      if (refresh) {
        toast.success("Showing latest messages", {
          duration: 1000,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // USE EFFECT
  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages
      });

      setValue('acceptMessage', !acceptMessages);
      toast.info(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message ?? "Failed to toggle message acceptance status",
        duration: 1000,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const username = session?.user?.username || (session?.user as User)?.email || "";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = username ? `${baseUrl}/u/${username}` : "";

  const copyToClipboard = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard", {
      duration: 1000,
    });
  };

  // Auth Guard: Render after hooks, but before main layout
  if (!session || !session.user) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <Card className="w-full max-w-md border border-border/60 bg-card/85 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center relative z-10">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your dashboard.</p>
          <Link href="/sign-in">
            <Button className="w-full font-bold">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex-grow bg-slate-50 dark:bg-slate-950 px-4 md:px-8 py-10 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl space-y-8 relative z-10">
        {/* Header Block */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1.5">
            Manage your public link status and read incoming anonymous feedback.
          </p>
        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Link Sharing Widget */}
          <Card className="md:col-span-2 border border-border/50 bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <LinkIcon className="size-4.5 text-primary" />
                <span>Copy Your Unique Link</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Share this link on your social profiles to receive anonymous messages.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 mt-4">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full px-3 py-2 border border-border bg-slate-100/50 dark:bg-slate-900/50 rounded-lg text-muted-foreground text-sm font-medium outline-none truncate"
              />
              <Button onClick={copyToClipboard} className="shrink-0 flex items-center gap-1.5 font-semibold">
                <Copy className="size-3.5" />
                <span>Copy</span>
              </Button>
            </div>
          </Card>

          {/* Status Widget */}
          <Card className="border border-border/50 bg-card/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Inbox className="size-4.5 text-purple-500" />
                <span>Inbox Status</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Toggle whether people can send feedback to your profile.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 bg-slate-100/50 dark:bg-slate-900/30 border border-border/30 rounded-xl p-3">
              <span className="text-sm font-semibold">
                Accept Messages
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  acceptMessages 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                    : 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400'
                }`}>
                  {acceptMessages ? 'Active' : 'Paused'}
                </span>
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
              </div>
            </div>
          </Card>
        </div>

        <Separator className="border-border/40" />

        {/* Messages Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>Your Messages</span>
            <span className="text-sm font-semibold text-muted-foreground px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-full">
              {messages.length}
            </span>
          </h2>
          <Button
            variant="outline"
            size="xs"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="shadow-sm font-semibold flex items-center gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
            <span>Refresh</span>
          </Button>
        </div>

        {/* Messages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/60 rounded-2xl bg-card/20 backdrop-blur-sm">
              <Inbox className="size-10 text-muted-foreground/50 mb-3" />
              <h3 className="font-bold text-base mb-1">No messages to display</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Share your unique link on social media to start receiving anonymous feedback!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
