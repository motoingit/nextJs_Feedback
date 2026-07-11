import { z } from "zod";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { apiResponse } from "@/utils/returnResponse";
import { HTTP_STATUS } from "@/utils/httpStatus";

//NOTE 📝: Validation schema for username query parameter
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

/**
 * ⬇️ GET handler to verify if a username is unique and verified in the system.
 * Expects 'username' as a URL search parameter.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the username is unique or already taken.
 */
export async function GET(req: Request) {
  console.log("API; GET /api/check-username-unique request received");
  
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    console.log(`DEBUG; Validating username: "${queryParam.username}"`);

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const errorMessage = usernameErrors.length > 0
        ? usernameErrors.join(", ")
        : 'Invalid query parameters';
      
      console.warn(`WARN; Username validation failed: ${errorMessage}`);
      
      return apiResponse(false, errorMessage, HTTP_STATUS.BAD_REQUEST);
    }

    //NOTE 📝: Check if username is already taken by a verified user
    const { username } = result.data;

    console.log(`DEBUG; Checking database for verified user: "${username}"`);
    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

    if (existingVerifiedUser) {
      console.warn(`WARN; Username "${username}" is already taken and verified.`);
      return apiResponse(false, "Username is already taken", HTTP_STATUS.CONFLICT);
    }

    console.info(`SUCCESS; Username "${username}" is unique and available.`);
    return apiResponse(true, "Username is unique", HTTP_STATUS.OK);

  } catch (error) {
    console.error("ERROR; Error checking username uniqueness:", error);
    return apiResponse(false, "Error checking username", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

