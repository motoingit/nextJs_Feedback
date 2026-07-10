import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"
import { apiResponse } from "@/utils/returnResponse";
import mongoose from "mongoose";

/**
 * ⬇️ GET handler to fetch all anonymous messages for the authenticated user.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing the sorted user messages.
 */
export async function GET(req: Request) {
  console.log("[API] GET /api/get-messages request received");

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn("[WARN] Unauthenticated attempt to access get-messages.");
    return apiResponse(
      false,
      'Not Authenticated',
      401
    );
  }

  //NOTE 📝: Cast user ID string to MongoDB ObjectId for aggregation pipeline
  const userId = new mongoose.Types.ObjectId(user._id);
  console.log(`[DEBUG] Retrieving messages for user: "${user.username}" (ID: ${userId})`);

  try {
    //NOTE 📝: MongoDB aggregation pipeline to unpack and sort user messages by creation date descending
    const userResult = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } }
    ]);

    if (!userResult || userResult.length === 0) {
      console.log(`[DEBUG] No messages found for user: "${user.username}"`);
      return apiResponse(
        true,
        'No Messages Found',
        200,
        { messages: [] }
      );
    }

    console.info(`[SUCCESS] Successfully retrieved ${userResult[0].messages.length} messages for "${user.username}".`);

    return apiResponse(
      true,
      'Messages retrieved successfully',
      200,
      { messages: userResult[0].messages }
    );

  } catch (error) {
    console.error("[ERROR] Unexpected error retrieving user messages:", error);
    return apiResponse(
      false,
      'Internal Server Error',
      500
    );
  }
}
