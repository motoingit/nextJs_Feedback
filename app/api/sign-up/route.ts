import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import sendVerificationEmail from "@/utils/sendVerificationEmail";

import bcrypt from "bcryptjs";


//* otp Genration
const generateOTP = () => {
  const MIN_OTP = 100000;
  const MAX_OTP = 999999;
  const generatedOTP = Math.floor(Math.random() * (MAX_OTP - MIN_OTP + 1) + MIN_OTP);
  return generatedOTP.toString();
}

//Funtion to acknoledge Reqest from frontend and send back response
export async function POST(req: Request) { //* Request if from nextjs
  try {
    await dbConnect()
    
    ///* It's coming from the HTTP request body sent by the frontend.
    const {username, email, password} = await req.json();


    //* IS THIS USER IS ALREADY IN DATABASE && IS THIS USER IS VERFIED
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })

    if(existingUserVerifiedByUsername){
      return Response.json(
        {
          success: false,
          //todo: QUES: can this be possible that username is taken but not verified
          message: 'Username is already Taken OR not verified'
        },
        {status: 400,}
      )
    }


    /*
    //* SURELY USER IS IN DATABASE
    //* BUT USER IS NOT VERIFIED
    */
    const existingUserByEmail = await UserModel.findOne({
      email,
    })

    //* generating verification code
    const verifyCode = generateOTP();

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

        // updating details
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);

        await existingUserByEmail.save();
      }

    //* USER HAS COME FIRST TIME 
    }else{
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

    //* NOW SEDING VERIFICATION CODE TO USER
    const emailResponse = await sendVerificationEmail(
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
        success: true,
        message: 'Username is Registerd Sucessfully'
      },
      {status: 201,}
    )

  } catch (error) {
    console.log(`Error on Registering User: Error Code : ${error}`);

    return Response.json(
      {
        success: false,
        message: 'Errror on regestering user'
      },
      {
        status:500
      }
    )
  }
}
