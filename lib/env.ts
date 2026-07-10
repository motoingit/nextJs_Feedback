import chalk from "chalk";
import { z } from "zod";

//Schema for .env Folder
const envSchema = z.object({

  DATABASE_API_KEY: z.string(),

  VERIFICATION_MESSAGE_SENDER_API_KEY: z.string(),

  NEXTAUTH_SECRET_KEY: z.string(),

  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  
});

console.log(
  chalk.greenBright("[INFO] > "),
  "Checking .env Format"
);
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(chalk.redBright("[Failed] > "),
    "environment variables are Not Appropriate"
  );

  for (const issue of result.error.issues) {
    console.error(chalk.yellow(` • ${issue.path.join(".")}: ${issue.message}`));
  }
  process.exit(1);
}else{
  console.info(
    chalk.greenBright("[SUCCESS] > "),
    "environment variables are verified"
  );
}

export const env = Object.freeze(result.data);
