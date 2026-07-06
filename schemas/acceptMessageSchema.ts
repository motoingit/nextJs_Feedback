import {z} from "zod"


export const acceptMessageSchema = z.object({
  //identifier is same as username
  acceptMessage: z.boolean(),
})
