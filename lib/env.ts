import "@/utils/logger-init";
import { z } from "zod";

//Schema for .env Folder
const envSchema = z.object({
  DATABASE_API_KEY: z.string(),
  VERIFICATION_MESSAGE_SENDER_API_KEY: z.string(),
  NEXTAUTH_SECRET_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
});

console.log("[INFO] Checking .env Format");
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("[ERROR] Environment variables are not appropriate");

  for (const issue of result.error.issues) {
    console.error(`[WARN]  • ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
} else {
  console.info("[SUCCESS] Environment variables are verified");
}

export const env = Object.freeze(result.data);
