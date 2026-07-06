import {z} from "zod"


export const signInSchema = z.object({
  //identifier is same as username
  identifier: z.string(),
  password: z.string(),
})
