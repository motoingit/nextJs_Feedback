import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { apiResponse } from "@/utils/returnResponse";
import mongoose from "mongoose";

/** ⬇️ MyCode
 *
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing.
*/
export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions)

  //todo: why we need assertion here (as)
  const user: User = session?.user as User;

  if(!session || !session.user){
    return apiResponse(
      false,
      'Not Authenticated',
      401
    )
  }

            //* AGREGATION PIPLEINE MONGODB
  //! common mistake
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    /* //todo: MULTIPLE PIPLEING
     */
    const user = await UserModel.aggregate([
      { $match: {id: userId}},

      //direct string when mongodb args
      { $unwind: '$messages'},
      { $sort: {'messages.createdAt': -1}},
      { $group: {_id: '$_id', messages: {$push: '$messages'}}}
    ])

    if(!user || user.length === 0){
      return apiResponse(
        false,
        'User Not Found or No Messages',
        401
      )
    }

    return apiResponse(
      true,
      'User Not Found or No Messages',
      401,
      //todo: do ehck this
      {messages: user[0].messages}
    )

  } catch (error) {
    console.log(`[debug-log]: LogString > An Unexpected Error: `, error);
    return apiResponse(
      false,
      'Unexpected Error',
      401
    )
  }
}
