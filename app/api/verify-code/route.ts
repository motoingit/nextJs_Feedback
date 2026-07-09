import {z} from "zod"

import {
  usernameValidation, 
  verificationCodeValidation,
} from "@/schemas/signUpSchema"

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


//* Makeing querry schema for testing
const verificationCodeQuerySchema = z.object({
  username: usernameValidation,
  verifyCode: verificationCodeValidation
})

/** ⬇️ POST handler to verify user registration by validating the 6-digit OTP code.
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the verification succeeded or failed.
 */
export async function POST(req: Request) {

  console.log(`[debug-log]: LogString > 📝 POST /api/verify-code request received`);

  try {
    await dbConnect();

    const body = await req.json();
    console.log(`[debug-log]: LogString > 📋 Parsing and validating verification code from request body of user : "${body?.username}"`);

    // Parse parameters using validation schema
    const result = verificationCodeQuerySchema.safeParse(body);

    //* if format is wrong from frontend
    if (!result.success) {

      // Gather both username and verifyCode validation errors from SafeParse
      const formatErrors = result.error.format();
      const usernameErrors = formatErrors.username?._errors || [];
      const verifyCodeErrors = formatErrors.verifyCode?._errors || [];
      const combinedErrors = [...usernameErrors, ...verifyCodeErrors];
      
      const errorMessage = combinedErrors.length > 0
        ? combinedErrors.join(', ')
        : 'Invalid request data';

      
      console.warn(`[warning-log]: LogString > ⚠️ Request format validation failed for verify-code : \x1b[33m${errorMessage}\x1b[0m`);

      return Response.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    //* on sucess check for username
    const { username, verifyCode } = result.data;
    console.log(`🔎 Searching for user : "${username}" to process verification code`);

    const user = await UserModel.findOne({ username });

    if (!user) {
      console.warn(`[warning-log]: LogString > ⚠️ Verification failed: User "${username}" not found.`);
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        { status: 404 } // Changed from 500 to 404 to represent Resource Not Found
      );
    }

    // Evaluate verification details
    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log(`[status-log]: LogString > 📊 OTP verification details : matches=${isCodeValid}, activePeriod=${isCodeNotExpired}, expectedExpiry=${user.verifyCodeExpiry}, currentTime=${new Date().toISOString()}`);

    //* if all good
    if (isCodeValid && isCodeNotExpired) {
      // Mark user as verified and clear verification code details to avoid reuse
      user.isVerified = true;
      await user.save();

      console.log(`[status-log]: LogString > ✅ User "${username}" is now verified successfully!`);
      return Response.json(
        {
          success: true,
          message: "Account verified successfully"
        },
        { status: 200 }
      );

    //* if exired code
    } else if (!isCodeNotExpired) {
      console.warn(`⚠️ Verification failed: Code has expired for user "${username}".`);
      return Response.json(
        {
          success: false,
          //*todo: this is the flow but we should resentMail
          message: "Verification code has expired. Please sign up again to receive a new code."
        },
        { status: 400 }
      );

    //* if Incorect otp
    } else {
      console.warn(`[status-log]: LogString > ⚠️ Verification failed: Incorrect code submitted for user "${username}".`);
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code"
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("[error-log]: LogString >❌ Fatal error during verification process:", error);
    return Response.json(
      {
        success: false,
        message: "Error on verifying user"
      },
      { status: 500 }
    );
  }
}

