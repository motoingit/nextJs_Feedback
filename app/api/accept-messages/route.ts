import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { apiResponse } from "@/utils/returnResponse";
import chalk from "chalk";

/**
 * ⬇️ POST handler to toggle/update the message acceptance status for the logged-in user.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the update succeeded or failed.
 */
export async function POST(req: Request) {
  console.log(
    chalk.blue("[API] > "),
    "POST /api/accept-messages request received"
  );

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn(
      chalk.yellow("[WARN] > "),
      "Unauthenticated attempt to update message acceptance."
    );
    return apiResponse(
      false,
      'Not Authenticated',
      401
    );
  }

  const userId = user._id;
  const { acceptMessage } = await req.json();
  console.log(
    chalk.gray("[DEBUG]"),
    `Updating acceptance status for user "${user.username}" to: ${acceptMessage}`
  );

  try {
    //NOTE 📝: Find and update the user's message acceptance status
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `Unable to find user "${user.username}" (ID: ${userId}) to update status.`
      );
      return apiResponse(
        false,
        'Unable to find user to update message acceptance status',
        404
      );
    }

    console.info(
      chalk.greenBright("[SUCCESS] > "),
      `Successfully updated message acceptance status for "${user.username}" to: ${acceptMessage}`
    );

    return apiResponse(
      true,
      'Message acceptance status updated successfully',
      200
    );

  } catch (error) {
    console.error(
      chalk.red("[ERROR] > "),
      'Error updating message acceptance status:',
      error
    );

    return apiResponse(
      false,
      'Error updating message acceptance status',
      500
    );
  }
}

/**
 * ⬇️ GET handler to check the message acceptance status for the logged-in user.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing the current acceptance status.
 */
export async function GET(req: Request) {
  console.log(
    chalk.blue("[API] > "),
    "GET /api/accept-messages request received"
  );

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn(
      chalk.yellow("[WARN] > "),
      "Unauthenticated attempt to check message acceptance."
    );
    return apiResponse(
      false,
      'Not Authenticated',
      401
    );
  }

  const userId = user._id;
  console.log(chalk.gray("[DEBUG]"), `Retrieving acceptance status for user: "${user.username}"`);

  try {
    const foundUser = await UserModel.findById(userId);
  
    if (!foundUser) {
      console.warn(
        chalk.yellow("[WARN] > "),
        `User not found for ID: ${userId}`
      );
      return apiResponse(
        false,
        'User not found',
        404
      );
    }
  
    console.info(
      chalk.greenBright("[SUCCESS] > "),
      `Retrieved acceptance status for "${user.username}": ${foundUser.isAcceptingMessage}`
    );

    return apiResponse(
      true,
      'Message acceptance status retrieved successfully',
      200,
      { isAcceptingMessage: foundUser.isAcceptingMessage }
    );

  } catch (error) {
    console.error(
      chalk.red("[ERROR] > "),
      'Error retrieving message acceptance status:',
      error
    );

    return apiResponse(
      false,
      'Error on retrieving message acceptance status',
      500
    );
  }
}
