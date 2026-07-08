import {z} from "zod"
import {usernameValidation, verificationCodeValidation} from "@/schemas/signUpSchema"

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


const verificationCodeQuerySchema = z.object({
  username: usernameValidation,
  verifyCode: verificationCodeValidation
})

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const result = verificationCodeQuerySchema.safeParse(body);

    // //for debugging and copy
    // console.log(`mydate*${new Date(Date.now() + 60 * 60 * 1000).toISOString()}*`);

    if (!result.success) {
      //todo: Format is depricated
      const usernameErrors = result.error.format().username?._errors || [];
      console.log(result.error.format());
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid format of req on verify-code',
        },
        { status: 400 }
      );
    }

    const { username, verifyCode } = result.data;
    const user = await UserModel.findOne({username: username})

    if(!user){
      return Response.json(
        {
          success:false,
          message: "User not FOund"
        },
        {status: 500}
      )
    }

    const isCodeValid = user.verifyCode === verifyCode
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeValid && isCodeNotExpired){
      user.isVerified = true
      await user.save()

      return Response.json(
        {
          success:true,
          message: "Account Verified Sucessfuly"
        },
        {status: 200}
      )
    } else if( !isCodeNotExpired){
      // Code has expired
      return Response.json(
        {
          success:false,
          message: "Code is Expired , Pleae signup again to get a new code"
        },
        {status: 400}
      )
    }else {
      // Code is incorrect
      return Response.json(
        {
          success:false,
          message: "Code is Incorrect"
        },
        {status: 400}
      )
    }

  } catch (error) {
    console.error("Error Verifiing user", error);

    return Response.json(
      {
        success:false,
        message: "Error Verifiing user"
      },
      {status: 500}
    )
  }
}
