import { createGoogle } from "@ai-sdk/google";

export const google = createGoogle({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
