import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const sendMessageSchema = z.object({
  receiverUsername: usernameValidation,
  senderUsername: usernameValidation.optional(),
  senderId: z.string().optional(),
  content: z
    .string()
    .min(1, "Content must not be empty")
    .max(100, "Content must not be longer than 100 characters"),
});
