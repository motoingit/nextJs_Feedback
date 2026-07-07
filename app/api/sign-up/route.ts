import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVefificationEmail } from "@/utils/sendVerificationEmail";

import bcrypt from "bcryptjs";
import { success } from "zod";
import { fa } from "zod/locales";

//Request, is coming from next.js
export async function POST(req: Request) {
  await dbConnect()

  try {
    const {username, email, password} = await req.json();

    //* is this user is presentANDverifed
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })

    if(existingUserVerifiedByUsername){
      return Response.json(
        {
          success: false,
          message: 'Username is already Taken'
        },
        {status: 400,}
      )
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    })
    //verification code gen
    const verifyCode = Math.floor(100000+Math.random()* 900000).toString();

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json(
          {
            success: false,
            message: 'User Already exist with this email'
          },
          {status: 400,}
        )
      }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);

        await existingUserByEmail.save();
      }
    }else{ //*first time user have comed
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      })

      await newUser.save();
    }
    //now send verification email
    const emailResponse = await sendVefificationEmail(
      email,
      username,
      verifyCode,
    )

    if(!emailResponse.success){
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {status: 500,}
      )
    }

    return Response.json(
      {
        success: false,
        message: 'Username is Registerd Sucessfully'
      },
      {status: 400,}
    )

  } catch (error) {
    console.log("Error Regenstering User",error);
    //* See Standerisation
    return Response.json(
      {
        success: false,
        message: 'Errro regestering user'
      },
      {
        status:500
      }
    )
  }
}

//stop now timelapse
