import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email format is incorrect"),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password is too short")
      .regex(passwordRegex, "Password doesn't match the rules"),
    passwordConfirmation: z.string(),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      path: ["passwordConfirmation"],
      message: "Passwords do not match",
    }
  );

export type SignUpSchema = z.infer<typeof signUpSchema>;
