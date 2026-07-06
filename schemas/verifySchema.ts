import {z} from "zod"


export const verifySchema = z.object({
  message: z.string().length(6, {error: "Verification code must be 6 digits"})
})
