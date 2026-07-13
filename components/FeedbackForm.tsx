"use client";

import React, { useState } from "react";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import { Loader2, Send, Sparkles, AlertCircle, CheckCircle, Info } from "lucide-react";
import { sendMessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";

interface FeedbackFormProps {
  receiverUsername: string;
  initialAcceptingMessages: boolean;
}

const PRESET_PROMPTS = [
  "What is my biggest strength and how can I leverage it?",
  "What area of my work or personality do you think I should improve?",
  "If you had to describe me in three words, what would they be and why?",
];

//note: receiverUsername = "defualt value"
export default function FeedbackForm({ receiverUsername, initialAcceptingMessages }: FeedbackFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(PRESET_PROMPTS);
  const [suggestPrompt, setSuggestPrompt] = useState("");

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialAcceptingMessages) {
      toast.error("This user is not accepting messages right now.");
      return;
    }

    // Client-side schema validation using Zod
    const payload = {
      receiverUsername,
      content,
      senderId: session?.user?._id || undefined,
      senderUsername: session?.user?.username || undefined,
    };

    const parseResult = sendMessageSchema.safeParse(payload);

    if (!parseResult.success) {
      // Find the specific error for the content field
      const contentError = parseResult.error.format().content?._errors[0];
      toast.warning(contentError || "Invalid message format.");
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", payload);
      
      if (response.data.success) {
        toast.success("Message sent anonymously!", {
          description: "Your message has been safely delivered.",
        });
        setContent(""); // Clear input
      } else {
        toast.error("Failed to send message", {
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to send message", {
        description: axiosError.response?.data.message ?? "An unexpected error occurred.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle generating message suggestions via Gemini
  const fetchAISuggestions = async () => {
    const promptToUse = suggestPrompt.trim() || "Ask me anything interesting";
    setIsSuggesting(true);
    
    try {
      const response = await axios.get<ApiResponse>(
        `/api/suggest-messages?prompt=${encodeURIComponent(promptToUse)}`
      );

      const resData = response.data as any;
      if (resData.success && resData.data?.suggestions) {
        // Split generated suggestions by double pipes
        const list = resData.data.suggestions
          .split("||")
          .map((q: string) => q.trim())
          .filter((q: string) => q.length > 0);
        
        setSuggestions(list);
        toast.success("Suggestions updated!", {
          description: "Click any suggestion below to fill your message.",
        });
      } else {
        toast.error("Failed to get suggestions", {
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch suggestions", {
        description: axiosError.response?.data.message ?? "Error getting AI prompts.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    // Truncate if exceeds the 100 character schema boundary
    if (question.length > 100) {
      setContent(question.substring(0, 97) + "...");
    } else {
      setContent(question);
    }
    toast.info("Prompt filled!");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col gap-6 relative z-10">
        
        {/* Header/Status Info Box */}
        <Card className="border border-border/60 bg-card/85 backdrop-blur-md shadow-xl rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Public Profile</span>
              <h1 className="text-xl font-bold">@{receiverUsername}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {initialAcceptingMessages ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="size-3.5" />
                  <span>Accepting Messages</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20">
                  <AlertCircle className="size-3.5" />
                  <span>Paused</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Message Input Box */}
        <Card className="border border-border/60 bg-card/85 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Send Feedback</CardTitle>
            <CardDescription>
              Write your constructive feedback, request, or question anonymously below.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="relative">
                <Textarea
                  value={content}
                  disabled={!initialAcceptingMessages}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    initialAcceptingMessages
                      ? "Write your message here... (maximum 100 characters)"
                      : "This user is currently not accepting new messages."
                  }
                  className="min-h-[110px] resize-none pr-12 rounded-xl focus-visible:ring-primary border-border bg-slate-50/50 dark:bg-slate-900/50"
                />
                
                {/* Character counter */}
                <div className="absolute right-3.5 bottom-3 text-[10px] font-bold text-muted-foreground/70 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-border/40">
                  <span className={content.length > 100 ? "text-rose-500" : ""}>{content.length}</span>
                  <span>/100</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSending || !initialAcceptingMessages || content.trim().length === 0}
                className="w-full font-bold shadow-lg hover:shadow-primary/10 transition-all duration-300 rounded-xl py-5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin size-4 mr-2" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    <span>Send Message Anonymously</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gemini AI Message Suggester */}
        <Card className="border border-border/60 bg-card/85 backdrop-blur-md shadow-xl rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <h2 className="font-bold text-sm">Need Inspiration?</h2>
            </div>
            
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-border/30 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
              Google Gemini
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={suggestPrompt}
              onChange={(e) => setSuggestPrompt(e.target.value)}
              placeholder="e.g. Strength feedback, icebreaker"
              className="w-full px-3 py-2 border border-border bg-slate-50/50 dark:bg-slate-900/50 rounded-xl text-sm outline-none focus:border-primary/50 transition-all placeholder:text-xs"
            />
            <Button
              type="button"
              disabled={isSuggesting}
              onClick={fetchAISuggestions}
              className="shrink-0 font-bold rounded-xl flex items-center gap-1.5"
            >
              {isSuggesting ? (
                <Loader2 className="animate-spin size-3.5" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              <span>Suggest</span>
            </Button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
              <Info className="size-3" />
              Click any bubble below to load it into your box:
            </span>
            
            <div className="flex flex-col gap-2 mt-1">
              {suggestions.map((question, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(question)}
                  className="text-left text-xs bg-slate-100/60 dark:bg-slate-900/40 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 border border-border/40 hover:border-primary/20 rounded-xl px-4 py-3 transition-all duration-200 line-clamp-2"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
