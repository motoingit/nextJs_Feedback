import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/Message";
import { apiResponse } from "@/utils/returnResponse";

/**
 * ⬇️ POST handler to send an anonymous message to a user.
 * 
 * @param req - Incoming HTTP request containing recipient username and message content.
 * @returns A JSON response indicating if the message was successfully saved.
 */
export async function POST(req: Request) {
  console.log("[API] POST /api/send-messages request received");

  await dbConnect();

  const { username, content } = await req.json();
  console.log(`[DEBUG] Attempting to send message to user: "${username}"`);

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      console.warn(`[WARN] Message send failed: User "${username}" not found.`);
      return apiResponse(
        false,
        'User Not Found',
        404
      );
    }

    //NOTE 📝: Verify if recipient user is accepting messages
    if (!user.isAcceptingMessage) {
      console.warn(`[WARN] Message send rejected: User "${username}" is not accepting messages.`);
      return apiResponse(
        false,
        'User is not accepting messages',
        403
      );
    }

    const newMessage = { content, createdAt: new Date() };

    //NOTE 📝: Push the new message (casted as Message) into the user's message array
    user.messages.push(newMessage as Message);
    await user.save();

    console.info(`[SUCCESS] Successfully delivered anonymous message to user "${username}".`);

    return apiResponse(
      true,
      'Message sent successfully',
      200,
      { messages: user.messages }
    );
    
  } catch (error) {
    console.error(`[ERROR] Unexpected error on adding message for user "${username}":`, error);
    return apiResponse(
      false,
      'Internal Server Error',
      500
    );
  }
}
