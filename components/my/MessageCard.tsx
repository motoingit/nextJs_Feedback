'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Message } from "@/model/Message"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"


type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

export function MessageCard({message, onMessageDelete}: MessageCardProps) {

  const handelDeleteConfirm = async () =>{
    const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

    toast.info(res.data.message,{

    })

    onMessageDelete(String(message._id));
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>CardTitle</CardTitle>
        {/** sir has use <X classname="w-5 h-5"> */}
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">Delete</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handelDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/** */}
          
        <CardDescription>
          CardDescription
        </CardDescription>
        {/* <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
      </CardHeader>

      {/* <CardContent>
      </CardContent> */}

      {/* <CardFooter className="flex-col gap-2">
      </CardFooter> */}
    </Card>
  )
}
