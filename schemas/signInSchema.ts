import { z } from "zod";
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
} from "./signUpSchema";

export const signInSchema = z.object({
  //identifier is same as username
  //note: when need both validation
  identifier: usernameValidation.or(emailValidation),
  password: passwordValidation,
});
