import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { apiResponse } from "@/utils/returnResponse";
import { HTTP_STATUS } from "@/utils/httpStatus";

/**
 * ⬇️ POST handler to toggle/update the message acceptance status for the logged-in user.
 *
 * @param req - Incoming HTTP request.
 * @returns A JSON response indicating if the update succeeded or failed.
 */
export async function POST(req: Request) {
  console.log("API; POST /api/accept-messages request received");

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn("WARN; Unauthenticated attempt to update message acceptance.");
    return apiResponse(false, "Not Authenticated", HTTP_STATUS.UNAUTHORIZED);
  }

  //extracting details from response and session
  const userId = user._id;
  const { acceptMessage } = await req.json();
  console.log(
    `DEBUG; Updating acceptance status for user "${user.username}" to: ${acceptMessage}`,
  );

  try {
    //NOTE 📝: Find and update the user's message acceptance status
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessage: acceptMessage },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      console.warn(
        `WARN; Unable to find user "${user.username}" (ID: ${userId}) to update status.`,
      );
      return apiResponse(
        false,
        "Unable to find user to update message acceptance status",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    console.info(
      `SUCCESS; Successfully updated message acceptance status for "${user.username}" to: ${acceptMessage}`,
    );

    return apiResponse(
      true,
      "Message acceptance status updated successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    console.error("ERROR; Error updating message acceptance status:", error);

    return apiResponse(
      false,
      "Error updating message acceptance status",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
  console.log("API; GET /api/accept-messages request received");

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn("WARN; Unauthenticated attempt to check message acceptance.");
    return apiResponse(false, "Not Authenticated", HTTP_STATUS.UNAUTHORIZED);
  }

  const userId = user._id;
  console.log(
    `DEBUG; Retrieving acceptance status for user: "${user.username}"`,
  );

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      console.warn(`WARN; User not found for ID: ${userId}`);
      return apiResponse(false, "User not found", HTTP_STATUS.NOT_FOUND);
    }

    console.info(
      `SUCCESS; Retrieved acceptance status for "${user.username}": ${foundUser.isAcceptingMessage}`,
    );

    return apiResponse(
      true,
      "Message acceptance status retrieved successfully",
      HTTP_STATUS.OK,
      { isAcceptingMessage: foundUser.isAcceptingMessage },
    );
  } catch (error) {
    console.error("ERROR; Error retrieving message acceptance status:", error);

    return apiResponse(
      false,
      "Error on retrieving message acceptance status",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
}
