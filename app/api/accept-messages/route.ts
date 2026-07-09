import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { apiResponse } from "@/utils/returnResponse";


/** ⬇️ MyCode
 *
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing.
*/
export async function POST(req: Request) {
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

  const userId = user._id;
  const {acceptMessage} = await req.json();

  try {
    //* Update the user's message acceptance status
    const updatedUser = UserModel.findOneAndUpdate(
      {_id: userId},
      {isAcceptingMessage: acceptMessage},
      {new:true}
    );

    if(!updatedUser){
      return apiResponse(
        false,
        'Unable to Find User to update message Acceptance status',
        404
      )
    }

    // *Successfully updated message acceptance status
    return apiResponse(
      true,
      'Message Acceptance statuse is Updated Sucessfuly',
      200
    )
  } catch (error) {

    console.error('Error updating message acceptance status:', error);

    return apiResponse(
      false,
      'Unhandled Error updating message acceptance statusy',
      500
    )
  }
}

/** ⬇️ MyCode
 *
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing.
*/
export async function GET(req:Request) {
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

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
  
    if(!foundUser){
      return apiResponse(
        false,
        'User not found',
        404
      )
    }
  
    return apiResponse(
      true,
      'User update suces',
      200
    )
  } catch (error) {

    console.error('Error updating message acceptance status:', error);

    return apiResponse(
      false,
      'Error on Retriving isAccepting params',
      500
    )
  }
}
