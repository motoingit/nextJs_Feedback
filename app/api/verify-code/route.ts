import { z } from "zod";
import chalk from "chalk";
import { apiResponse } from "@/utils/returnResponse";

import {
  usernameValidation, 
  verificationCodeValidation,
} from "@/schemas/signUpSchema";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

//NOTE 📝: Validation schema for verification code query payload
const verificationCodeQuerySchema = z.object({
  username: usernameValidation,
  verifyCode: verificationCodeValidation
});

/**
 * ⬇️ POST handler to verify user registration by validating the OTP.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the verification succeeded or failed.
 */
export async function POST(req: Request) {
  console.log(
    chalk.blue("[API] > "),
    "POST /api/verify-code request received"
  );

  try {
    await dbConnect();

    const body = await req.json();
    console.log(chalk.gray("[DEBUG]"), `Validating payload for user: "${body?.username}"`);

    const result = verificationCodeQuerySchema.safeParse(body);

    //WARN ⚠️: Request body validation failed
    if (!result.success) {
      const formatErrors = result.error.format();
      const usernameErrors = formatErrors.username?._errors || [];
      const verifyCodeErrors = formatErrors.verifyCode?._errors || [];
      const combinedErrors = [...usernameErrors, ...verifyCodeErrors];
      
      const errorMessage = combinedErrors.length > 0
        ? combinedErrors.join(', ')
        : 'Invalid request data';

      console.warn(
        chalk.yellow("[WARN] > "),
        `Request format validation failed: ${errorMessage}`
      );

      return apiResponse(false, errorMessage, 400);
    }

    const { username, verifyCode } = result.data;
    console.log(chalk.gray("[DEBUG]"), `Searching for user: "${username}"`);

    const user = await UserModel.findOne({ username });

    if (!user) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `Verification failed: User "${username}" not found.`
      );
      return apiResponse(false, "User not found", 404);
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log(
      chalk.gray("[DEBUG]"),
      `OTP evaluation: matches=${isCodeValid}, activePeriod=${isCodeNotExpired}`
    );

    //NOTE 📝: Account is successfully verified
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      console.info(
        chalk.greenBright("[SUCCESS] > "),
        `User "${username}" verified successfully.`
      );

      return apiResponse(true, "Account verified successfully", 200);
    }

    //WARN ⚠️: Verification code has expired
    if (!isCodeNotExpired) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `Verification failed: Code expired for user "${username}".`
      );

      return apiResponse(
        false,
        //REMINDER ⏰: Integrate automatic resend verification email flow here
        "Verification code has expired. Please sign up again to receive a new code.",
        400
      );
    }

    //WARN ⚠️: Verification code is incorrect
    console.warn(
      chalk.yellow("[WARN] > "),
      `Verification failed: Incorrect code submitted for user "${username}".`
    );

    return apiResponse(false, "Incorrect verification code", 400);

  } catch (error) {
    console.error(
      chalk.red("[ERROR] > "),
      "Fatal error during verification process:",
      error
    );

    return apiResponse(false, "Error on verifying user", 500);
  }
}

