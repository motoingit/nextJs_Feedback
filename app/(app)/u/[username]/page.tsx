"use client";

import React, { useEffect, useState, use } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import FeedbackForm from "@/components/FeedbackForm";
import UserNotFound from "@/components/my/UserNotFound";
import { ApiResponse } from "@/types/ApiResponse";

interface InputMessagePageProps {
  params: Promise<{ username: string }>;
}

type UserStatusResponse = ApiResponse & {
  data?: {
    exists: boolean;
    isAcceptingMessage: boolean;
  };
};

/**
 * Client-Side Page Component to check recipient profile status and load the feedback form.
 */
export default function InputMessagePage(props: InputMessagePageProps) {
  // Next.js 15 unwraps dynamic route params asynchronously on the client using React.use
  const { username } = use(props.params);

  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get<UserStatusResponse>(
          `/api/get-user-status?username=${username}`,
        );

        if (response.data.success && response.data.data?.exists) {
          setUserExists(true);
          setIsAcceptingMessage(response.data.data.isAcceptingMessage);
        }
      } catch {
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, [username]);

  // Loading Screen State
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin size-8 text-primary" />
          <p className="text-sm font-semibold text-muted-foreground">
            Checking profile status...
          </p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!userExists) {
    return <UserNotFound username={username} />;
  }

  // Active Form State
  return (
    <FeedbackForm
      receiverUsername={username}
      initialAcceptingMessages={isAcceptingMessage}
    />
  );
}
