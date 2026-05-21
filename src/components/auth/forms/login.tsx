import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { ApiError, login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "../google-sign-in-button";
import { LoginFormSchema } from "../auth";

export default function LoginForm({
	toggleMode,
	onEmailSent,
}: {
	toggleMode: () => void;
	onEmailSent: (email: string) => void;
}) {
	const [loading, setLoading] = useState(false);
	const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: { email: "" },
	});

	async function onLoginSubmit(data: z.infer<typeof LoginFormSchema>) {
		setLoading(true);
		try {
			await login(data.email);
			onEmailSent(data.email);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : "Could not sign in.",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Form {...loginForm}>
				<form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
					<div className="flex w-full flex-col gap-[19px] text-center">
						<div className="flex flex-col w-full gap-4 items-center">
							<GoogleSignInButton disabled={loading} />
							<p className="text-[16px] font-normal text-[#1C1F22]">or</p>
							<FormField
								control={loginForm.control}
								name="email"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input
												placeholder="E-mail"
												className="py-2.5 px-5 h-[45px] text-[16px] font-normal text-[#1C1F22]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button
							size="lg"
							type="submit"
							className="rounded-full h-[45px]"
							disabled={loading}
						>
							{loading ? "Sending…" : "Continue with email"}
						</Button>
					</div>
				</form>
			</Form>
			<DialogFooter className="justify-center">
				<Button variant="link" onClick={toggleMode} type="button">
					<span className="text-blue-500 text-[16px] font-normal">
						Create account
					</span>
				</Button>
			</DialogFooter>
		</>
	);
}
