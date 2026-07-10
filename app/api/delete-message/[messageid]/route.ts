import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"
import { apiResponse } from "@/utils/returnResponse";
import chalk from "chalk";

/**
 * ⬇️ DELETE handler to remove a specific message from the user's message array.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating success or failure.
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ messageid: string }> }) {
  const { messageid } = await params;
  const messageId = messageid;
  
  console.log(
    chalk.blue("[API] > "),
    "DELETE /api/delete-message/" + messageId + " request received"
  );

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn(
      chalk.yellow("[WARN] > "),
      "Unauthenticated attempt to delete message."
    );
    return apiResponse(
      false,
      'Not Authenticated',
      401
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `Delete failed: Message ID "${messageId}" not found for user "${user.username}".`
      );
      return apiResponse(
        false,
        "Message Not Deleted or already deleted",
        404
      );
    }

    console.info(
      chalk.greenBright("[SUCCESS] > "),
      `Successfully deleted message ID "${messageId}" for user "${user.username}".`
    );

    return apiResponse(
      true,
      "Message Deleted",
      200
    );
    
  } catch (error) {
    console.error(
      chalk.red("[ERROR] > "),
      "Failed to delete message:",
      error
    );

    return apiResponse(
      false,
      "Internal Server Error on deleting message",
      500
    );
  }
}
