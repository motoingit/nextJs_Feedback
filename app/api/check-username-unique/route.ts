import {z} from "zod"

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


//Querry Schema for Testing
const UsernameQuerySchema = z.object({
  username: usernameValidation,
})

/* //todo: Optimisation can be done - Debouncing techniqueu
  - username avalable hai ki nahi in frontend realtime
*/

/** GET handler to verify if a username is unique and verified in the system.
 * Expects 'username' as a URL search parameter.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the username is unique or already taken.
 */
export async function GET(req: Request) {
  console.log("[status-log]: LogString > 🔍 GET /api/check-username-unique request received");
  
  try {
    await dbConnect();

    //* Extract query parameters from URL which gives url-like-object
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    console.log(`[status-log]: LogString > 📋 Validating username : "${queryParam.username}"`);

    //* Validate APi Format from frontend using Zod schema
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const errorMessage = usernameErrors.length > 0
        ? usernameErrors.join(", ")
        : 'Invalid query parameters';
      
      console.warn(`[error-log]: LogString > ⚠️ Username validation failed : ${errorMessage}`);
      
      return Response.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 } // Bad Request is more appropriate than 500 for validation failures
      );
    }

    //* Search the database for any verified user with the same username
    const { username } = result.data;

    console.log(`[status-log]: LogString > 🔎 Checking database for verified user with username: "${username}"`);
    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

    if (existingVerifiedUser) {
      console.log(`❌ Username "${username}" is already taken and verified.`);
      return Response.json(
        {
          success: false,
          message: "Username is already taken"
        },
        { status: 400 }
      );
    }

    console.log(`✅ Username "${username}" is unique and available.`);
    return Response.json(
      {
        success: true,
        message: "Username is unique"
      },
      { status: 200 }
    );

  //! Unhandeled Error Section - ServerError
  } catch (error) {
    console.error("❌ Error checking username uniqueness:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username"
      },
      { status: 500 }
    );
  }
}

