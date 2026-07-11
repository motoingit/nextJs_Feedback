import "../utils/logger-init";
import { z } from "zod";

//Schema for .env Folder
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  DATABASE_API_KEY: z.string(),
  VERIFICATION_MESSAGE_SENDER_API_KEY: z.string(),
  NEXTAUTH_SECRET: z.string(),

  NEXTAUTH_URL: z.url().refine(
    (url) => {
      if (process.env.NODE_ENV === "development") {
        return url.startsWith("http://localhost");
      }
      // Production
      return url.startsWith("https://");
    },
    {
      message:
        "NEXTAUTH_URL must be [http://localhost] in development and [https://] in production",
    },
  ),

  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
});

// CHECKING
console.log();
console.log("INFO; Checking .env Format");
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "ERROR; Environment variables are not appropriate, See Warning Below",
  );

  for (const issue of result.error.issues) {
    console.error(`WARN; : ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
} else {
  console.info("SUCCESS; Environment variables are verified");
}

export const env = Object.freeze(result.data);

/*
Question: why import "@/utils/logger-init"; give error

Node.js
   │
   ▼
next.config.ts
   │
   ▼
lib/env.ts
   │
   ▼
import "@/utils/logger-init"
*/
