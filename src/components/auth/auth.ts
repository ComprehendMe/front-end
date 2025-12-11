import z from "zod";

const LoginFormSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .min(1, "Email is required"),
});

const SignUpFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  email: z
    .email({ message: "Please enter a valid email address." })
    .min(1, "Email is required"),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9@]{6,30}$/, {
      message:
        "Password must include uppercase, lowercase, number and special character.",
    })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export { LoginFormSchema, SignUpFormSchema };
