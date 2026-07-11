import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message, MessageSchema } from "@/model/Message";
import { apiResponse } from "@/utils/returnResponse";
import { HTTP_STATUS } from "@/utils/httpStatus";
import mongoose from "mongoose";

import { sendMessageSchema } from "@/schemas/messageSchema";

// ⬇️ POST handler to send an anonymous message to a user.
// @param req - Incoming HTTP request containing recipient username and message content.
// @returns A JSON response indicating if the message was successfully saved.
export async function POST(req: Request) {
  console.log("API; POST /api/send-messages request received");

  console.log("DEBUG; Checking the Response Format");
  const body = await req.json();
  const response = sendMessageSchema.safeParse(body);

  if (!response.success) {
    const errorDetails = response.error.issues.map((i) => i.message).join(", ");
    console.log(`ERROR; Response body validation failed: ${errorDetails}`);
    return apiResponse(false, errorDetails, HTTP_STATUS.BAD_REQUEST);
  }

  const { receiverUsername, senderUsername, senderId, content } = response.data;

  console.log(
    `DEBUG; Attempting to send message to ${receiverUsername} (senderId: ${senderUsername || "anonymous"})`,
  );

  try {
    // Connecting to Database
    await dbConnect();

    const receiverObject = await UserModel.findOne({
      username: receiverUsername,
    });

    if (!receiverObject) {
      console.warn(
        `WARN; Message send failed: User "${receiverUsername}" not found.`,
      );
      return apiResponse(false, "User Not Found", HTTP_STATUS.NOT_FOUND);
    }

    //NOTE 📝: Verify if recipient user is accepting messages
    if (!receiverObject.isAcceptingMessage) {
      console.warn(
        `WARN; Message send rejected: User "${receiverUsername}" is not accepting messages.`,
      );
      return apiResponse(
        false,
        "User is not accepting messages",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    // making Message
    const newMessage = {
      content,
      createdAt: new Date(),
      senderId: senderId ? new mongoose.Types.ObjectId(senderId) : undefined,
    };

    //NOTE 📝: Push the new message (casted as Message) into the user's message array
    receiverObject.messages.push(newMessage as Message);

    const resData = await receiverObject.save();

    if (!resData) {
      console.warn(
        `WARN; Message send failed: Could not save message for user "${receiverUsername}".`,
      );
      return apiResponse(
        false,
        "Failed to save message",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    console.info(
      `SUCCESS; Successfully delivered anonymous message to user "${receiverUsername}".`,
    );

    return apiResponse(true, "Message sent successfully", HTTP_STATUS.OK, {
      messages: resData.messages,
    });
  } catch (error) {
    console.error(
      `ERROR; Unexpected error on adding message for user "${receiverUsername}":`,
      error,
    );

    return apiResponse(
      false,
      "Internal Server Error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
}
