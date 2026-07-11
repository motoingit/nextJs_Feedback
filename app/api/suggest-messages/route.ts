import { generateText } from "ai";
import { google } from "@/lib/gemini";
import { z } from "zod";
import { apiResponse } from "@/utils/returnResponse";
import { HTTP_STATUS } from "@/utils/httpStatus";

//NOTE 📝: Validation schema for prompt query parameter
const querySchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required.")
    .max(500, "Prompt cannot exceed 500 characters."),
});

/**
 * ⬇️ GET handler to generate feedback prompt suggestions using Google Gemini.
 * 
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing generated suggestions.
 */
export async function GET(request: Request): Promise<Response> {
  console.log("API; GET /api/suggest-messages request received");

  try {
    const { searchParams } = new URL(request.url);

    const validation = querySchema.safeParse({
      prompt: searchParams.get("prompt") ?? "",
    });

    if (!validation.success) {
      console.warn("WARN; Prompt validation failed for suggest-messages.");
      return apiResponse(
        false,
        "Validation failed.",
        HTTP_STATUS.BAD_REQUEST,
        validation.error.flatten().fieldErrors
      );
    }

    const { prompt } = validation.data;
    console.log(`DEBUG; Generating prompt suggestions for: "${prompt}"`);

    const { text, usage, finishReason } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `
      You generate exactly three engaging, open-ended questions.

      Rules:
      - Return ONLY plain text.
      - Separate each question using "||".
      - No numbering.
      - No markdown.
      - No explanations.
      - No emojis.
      - Keep the questions friendly.
      - Avoid political, religious, offensive, sexual, or personal topics.
      - Suitable for an anonymous feedback platform.
      `,
      prompt,
    });

    console.info("SUCCESS; Successfully generated message suggestions from AI.");

    return apiResponse(
      true,
      "Suggestions generated successfully",
      HTTP_STATUS.OK,
      {
        suggestions: text,
        usage,
        finishReason,
      }
    );

  } catch (error) {
    console.error("ERROR; Fatal error during suggest-messages generation:", error);

    if (error instanceof Error) {
      return apiResponse(false, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return apiResponse(false, "Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
