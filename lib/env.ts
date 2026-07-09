import { z } from "zod";

const envSchema = z.object({
  MONGO_DB_URI: z
    .string()
    .startsWith("mongodb", {
      message: "Invalid MongoDB connection string",
    }),

  RESEND_API_KEY: z
    .string()
    .startsWith("re_", {
      message: "Invalid Resend API key",
    }),

  NEXTAUTH_SECRET_KEY: z
    .string()
    .min(32, "NEXTAUTH_SECRET_KEY should be at least 32 characters"),

  NEXTAUTH_URL: z.string().url().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration:");

  for (const issue of result.error.issues) {
    console.error(` • ${issue.path.join(".")}: ${issue.message}`);
  }

  process.exit(1);
}

export const env = Object.freeze(result.data);
