import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be more than  character long! ")
  .max(20, "Username must be less than 20 characters long!")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username must contain only letters, numbers, and underscores!"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(8, "Password must be more than 8 characters long!"),
});
