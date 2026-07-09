import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { apiResponse } from "@/utils/returnResponse";
import sendVerificationEmail from "@/utils/sendVerificationEmail";

import bcrypt from "bcryptjs";
import { userAgent } from "next/server";


//* otp Genration
const generateOTP = () => {
  const MIN_OTP = 100000;
  const MAX_OTP = 999999;
  const generatedOTP = Math.floor(Math.random() * (MAX_OTP - MIN_OTP + 1) + MIN_OTP);
  return generatedOTP.toString();
}

// Function to acknowledge request from frontend and send back response
export async function POST(req: Request) {
  console.log("📝 POST /api/sign-up request received");

  await dbConnect();
  
  try {
    // Extract sign up parameters from the request body
    const { username, email, password } = await req.json();
    console.log(`📋 Received sign-up request details: Username="${username}", Email="${email}"`);

    // 1. Check if the username is already taken by a verified user
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    });

    if (existingUserVerifiedByUsername) {
      console.warn(`⚠️ Sign-up rejected: Username "${username}" is already taken by a verified user.`);
      return Response.json(
        {
          success: false,
          message: 'Username is already taken'
        },
        { status: 400 }
      );
    }

    // 2. Clear any unverified users holding this username with a different email.
    // This frees the username field to avoid MongoDB E11000 unique index collisions.
    const deletedConflicts = await UserModel.deleteMany({
      username,
      email: { $ne: email },
      isVerified: false
    });
    if (deletedConflicts.deletedCount > 0) {
      console.log(`🧹 Cleared ${deletedConflicts.deletedCount} unverified conflicting user account(s) using username "${username}"`);
    }

    // Generate a fresh 6-digit OTP code
    const verifyCode = generateOTP();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Code expires in 1 hour

    // 3. Check if a user with this email already exists
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.warn(`⚠️ Sign-up rejected: Email "${email}" is already registered and verified.`);
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email'
          },
          { status: 400 }
        );
      } else {
        // Email is not verified yet. Update details with new username, password, and fresh OTP
        console.log(`🔄 Updating existing unverified user details for email "${email}"`);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();
        console.log(`✅ Successfully updated unverified user "${username}" in the database.`);
      }
    } else {
      // First-time signup. Create a brand new user document
      console.log(`🆕 Creating a new user record for "${username}" (${email})`);
      
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
      console.log(`✅ Successfully saved new user "${username}" to the database.`);
    }

    // 4. Dispatch the verification OTP email
    console.log(`📧 Dispatched verification flow for "${username}" to email "${email}"`);
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      console.error(`❌ Verification email dispatch failed: ${emailResponse.message}`);
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    console.log(`🎉 User "${username}" successfully registered and verification email sent.`);
    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email.'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(`❌ Fatal error during user registration process:`, error);
    
    //todo: custm implemented
    return apiResponse(
      false,
      "Error registering user",
      500,
    );
  }
}

