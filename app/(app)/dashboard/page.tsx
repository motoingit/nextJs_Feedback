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

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/my/MessageCard";
import { Loader2, RefreshCcw } from "lucide-react";
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center p-6 bg-white rounded shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl shadow-sm border border-gray-100">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-500 text-sm outline-none"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm font-medium">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator className="my-6" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Messages</h2>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No messages to display.</p>
        )}
      </div>
    </div>
  );
}
