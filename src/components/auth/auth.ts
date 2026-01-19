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
});

export { LoginFormSchema, SignUpFormSchema };
