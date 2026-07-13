import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { apiResponse } from "@/utils/returnResponse";
import { HTTP_STATUS } from "@/utils/httpStatus";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const QuerySchema = z.object({
  username: usernameValidation,
});

/**
 * ⬇️ GET handler to check if a user profile exists and fetch their message acceptance status.
 */
export async function GET(req: Request) {
  console.log("API; GET /api/get-user-status request received");

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    const result = QuerySchema.safeParse({ username });

    if (!result.success) {
      return apiResponse(false, "Invalid username", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await UserModel.findOne({ username: result.data.username, isVerified: true });

    if (!user) {
      return apiResponse(false, "User not found", HTTP_STATUS.NOT_FOUND);
    }

    return apiResponse(
      true, 
      "User status retrieved", 
      HTTP_STATUS.OK, 
      { exists: true,
        isAcceptingMessage: user.isAcceptingMessage,
    });
    
  } catch (error) {
    console.error("ERROR; Failed to get user status:", error);
    return apiResponse(false, "Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
