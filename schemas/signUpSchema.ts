import { z } from "zod";

//warn: this usernameValidation is not modular + it
//note: /^[a-zA-Z][a-zA-Z0-9_]*$/

//* username validation zod object
export const usernameValidation = z
  .string()
  .min(1, "Username must not Be Empty")
  .max(10, "Username must be no more than 10 characters")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9_]*$/,
    "Username must not contain special characters",
  );

//* email validation zod object
export const emailValidation = z.email();
// export const emailValidation = z
//   .string()
//   .email({error: 'Invalid Email Adress'}); //! depricated

// * password validation zod object
export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(20, { message: "Password must be no more than 20 characters" });

// * codeOTP validation zod object
export const verificationCodeValidation = z.string().length(6, {
  //! hardcoded otp
  message: "Verification code must be exactly 6 digits",
});

//MAIN Validation
export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });
