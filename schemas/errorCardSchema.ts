import { z } from "zod";

//* username validation zod object
export const titleValidation = z
  .string()
  .min(30, "title is too short")
  .max(50, "title is too long");

export const descriptionValidation = z
  .string()
  .min(20, "description is too short")
  .max(300, "description is too long");

export const errorCodeValidation = z
  .number()
  .min(3, "error code is invalid (min3)")
  .max(3, "error code is invalid (max3)");

//MAIN Validation
export const errorCardSchema = z.object({
  title: titleValidation,
  description: descriptionValidation,
  code: errorCodeValidation,
});
