import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { apiResponse } from "@/utils/returnResponse";
import sendVerificationEmail from "@/utils/sendVerificationEmail";

import bcrypt from "bcryptjs";
import chalk from "chalk";

//NOTE 📝: Generate a 6-digit OTP verification code
const generateOTP = () => {
  const MIN_OTP = 100000;
  const MAX_OTP = 999999;
  const generatedOTP = Math.floor(Math.random() * (MAX_OTP - MIN_OTP + 1) + MIN_OTP);
  return generatedOTP.toString();
}

/**
 * ⬇️ POST handler to register a new user and trigger verification flow.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the registration succeeded or failed.
 */
export async function POST(req: Request) {
  console.log(
    chalk.blue("[API] > "),
    "POST /api/sign-up request received"
  );

  try {
    await dbConnect();

    const { username, email, password } = await req.json();
    console.log(
      chalk.gray("[DEBUG]"),
      `Received sign-up request details: Username="${username}", Email="${email}"`
    );

    //NOTE 📝: Check if the username is already taken by a verified user
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    });

    if (existingUserVerifiedByUsername) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `Sign-up rejected: Username "${username}" is already taken by a verified user.`
      );
      return apiResponse(false, 'Username is already taken', 400);
    }

    //NOTE 📝: Clear any unverified users holding this username to prevent unique constraint collisions
    const deletedConflicts = await UserModel.deleteMany({
      username,
      email: { $ne: email },
      isVerified: false
    });
    
    if (deletedConflicts.deletedCount > 0) {
      console.log(
        chalk.gray("[DEBUG]"),
        `Cleared ${deletedConflicts.deletedCount} unverified conflicting user account(s) using username "${username}"`
      );
    }

    //NOTE 📝: Generate verification code and expiry date (1 hour)
    const verifyCode = generateOTP();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    //NOTE 📝: Check if a user with this email already exists
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.warn(
          chalk.yellow("[WARN] > "),
          `Sign-up rejected: Email "${email}" is already registered and verified.`
        );
        return apiResponse(false, 'User already exists with this email', 400);
      } else {
        //NOTE 📝: Update unverified user details with new username, password, and fresh OTP
        console.log(
          chalk.gray("[DEBUG]"),
          `Updating existing unverified user details for email "${email}"`
        );
        
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();
        console.info(
          chalk.greenBright("[SUCCESS] > "),
          `Successfully updated unverified user "${username}" in the database.`
        );
      }
    } else {
      //NOTE 📝: Create a brand new user record for first-time sign-up
      console.log(
        chalk.gray("[DEBUG]"),
        `Creating a new user record for "${username}" (${email})`
      );
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      });

      await newUser.save();
      console.info(
        chalk.greenBright("[SUCCESS] > "),
        `Successfully saved new user "${username}" to the database.`
      );
    }

    //NOTE 📝: Dispatch the verification OTP email
    console.log(
      chalk.gray("[DEBUG]"),
      `Dispatched verification flow for "${username}" to email "${email}"`
    );
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      console.error(
        chalk.red("[ERROR] > "),
        `Verification email dispatch failed: ${emailResponse.message}`
      );
      return apiResponse(false, emailResponse.message, 500);
    }

    console.info(
      chalk.greenBright("[SUCCESS] > "),
      `User "${username}" successfully registered and verification email sent.`
    );
    
    return apiResponse(
      true,
      'User registered successfully. Please verify your email.',
      201
    );

  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("E11000 duplicate key error")
    ) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `Duplicate key detected during sign-up: ${error.message}`
      );

      return apiResponse(false, 'Username or email is already in use', 400);
    }

    console.error(
      chalk.red("[ERROR] > "),
      "Fatal error during user registration process:",
      error
    );

    return apiResponse(
      false,
      "Error registering user",
      500
    );
  }
}


