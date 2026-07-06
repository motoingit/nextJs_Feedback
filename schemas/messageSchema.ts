import {z} from "zod"


export const acceptMessageSchema = z.object({
  //identifier is same as username
  content: z
    .string()
    .min(10, {error: 'Content Must be at least'})
    .max(300, {error: "no longer than 300char"})
})
