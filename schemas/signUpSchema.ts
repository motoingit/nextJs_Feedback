import {z} from 'zod'


// username validation zod object
export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

// email validation zod object
export const emailValidation = z.email();
// export const emailValidation = z
//   .string()
//   .email({error: 'Invalid Email Adress'}); //! depricated

// email validation zod object
export const passwordValidation = z
  .string()
  .min(4, {error: "Pass must be 6 char"})
  .max(8)


//MAIN Validation
export const signUpSchema = z
  .object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords do not match",
  //   path: ["confirmPassword"],
  // });
