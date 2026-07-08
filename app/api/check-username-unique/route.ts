import {z} from "zod"

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


//squery schema
const UsernameQuerySchema = z.object({
  username: usernameValidation,
})

/* Optimisation can be done - Debouncing techniqueu
  - username avalable hai ki nahi in frontend realtime
*/

export async function POST(req:Request) {

  //NOTE: Next js already handles the wrong request 'POST'

  await dbConnect()

  try {

    //This will give whole URL - {http://localhost:3000/api/cuu?username?phone=android}
    const {searchParams} = new URL(req.url)
    const queryParam = {
      username: searchParams.get('username')
    }

    /* //* Validation with ZOD
    this queryParams is just additional validation of is schema foolowing
     */
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("This is Result",result) //todo: remove

    if(!result.success){
      //todo: Depricated format here
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json(
        {
          success:false,
          message: usernameErrors?.length > 0  
                  ? usernameErrors.join(", ")  
                  : 'invalid query parameters',
        },
        {status: 500}
      )
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

    if(existingVerifiedUser){
      return Response.json(
        {
          success:false,
          message: "Username is already taken"
        },
        {status: 400}
      )
    }

    return Response.json(
      {
        success:true,
        message: "Username is unique"
      },
      {status: 200}
    )

  } catch (error) {
    console.error("Error checking Username", error);
    return Response.json(
      {
        success:false,
        message: "Error chekcnign username"
      },
      {status: 500}
    )
  }
}
