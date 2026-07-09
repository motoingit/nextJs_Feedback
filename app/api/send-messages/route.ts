import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/Message";
import { apiResponse } from "@/utils/returnResponse";

export async function POST(req:Request) {
  await dbConnect()

  const {username, content} = await req.json()

  try {
    
    const user = await UserModel.findOne({username});

    if(!user){
      return apiResponse(
        false,
        'User Not Found',
        404
      )
    }

    // is user acepting message ?
    if(!user.isAcceptingMessage){
      return apiResponse(
        false,
        'User is not accepting message',
        403
      )
    }

    const newMessage = {content, createdAt: new Date()};

    //todo: This {as} is assertion and have to put in ts , as it says that i will insure u that this newMesage is comming in MEssagInterfaceFomat
    user.messages.push(newMessage as Message);

    await user.save();

    return apiResponse(
      true,
      'User is Accepting message',
      200,
      { messages: user.messages }
    )
    
  } catch (error) {
    console.log(`[debug-log]: LogString > An Unexpected Error on Adding Messages : `, error);
    return apiResponse(
      false,
      'Internal Server Error',
      500
    )
  }
}
