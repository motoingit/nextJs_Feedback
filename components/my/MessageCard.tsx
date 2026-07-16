"use client";

import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import { Message } from "@/model/Message";
import { toast } from "sonner";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard(props: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const res: AxiosResponse<ApiResponse> = await axios.delete<ApiResponse>(
        `/api/delete-message/${props.message._id}`,
      );

      if (!res.data.success) {
        toast.error(
          res.data.message || "Message Cannot be deleted - InternalError",
        );
        return;
      }

      toast.success(res.data.message || "Message deleted successfully");

      props.onMessageDelete(String(props.message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ?? "Failed to delete message",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <CardHeader className="p-0 pb-3 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold leading-relaxed text-foreground break-words">
            {props.message.content}
          </CardTitle>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                size="xs"
                className="shrink-0 p-2 h-8 w-8 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border-none shadow-none"
              >
                <Trash2 className="size-4" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this anonymous
                feedback message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" /> Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="p-0 flex items-center justify-between text-xs text-muted-foreground font-medium pt-2 border-t border-border/30">
        <span>Received via link</span>
        <span>
          {new Date(props.message.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </CardContent>
    </Card>
  );
}
