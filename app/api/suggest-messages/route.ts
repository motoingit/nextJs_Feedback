import {
  streamText,
  createTextStreamResponse,
  toTextStream,
  generateText,
} from "ai";

import { google } from "@/lib/gemini";
import { z } from "zod";


// QuerrySchema 
const querySchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required.")
    .max(500, "Prompt cannot exceed 500 characters."),
});

/**
 * ⬇️ MyCode
 *
 * @param req - Incoming HTTP request.
 * @returns A JSON response containing.
 */
export async function GET(request: Request): Promise<Response> {

  try {
    const { searchParams } = new URL(request.url);

    const validation = querySchema.safeParse({
      prompt: searchParams.get("prompt") ?? "",
    });

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    //* Prompt Genration
    const { prompt } = validation.data;
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

    //* REspnose
    return Response.json(
      {
        success: true,
        data: {
          suggestions: text,
          usage,
          finishReason,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SUGGEST_MESSAGES_ERROR]", error);

    if (error instanceof Error) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
