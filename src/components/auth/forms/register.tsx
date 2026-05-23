import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { ApiError, signup } from "@/lib/api";
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
import { SignUpFormSchema } from "../auth";

export default function SignUpForm({
	toggleMode,
	onEmailSent,
}: {
	toggleMode: () => void;
	onEmailSent: (email: string) => void;
}) {
	const [loading, setLoading] = useState(false);
	const signUpForm = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { name: "", email: "" },
	});

	async function onRegisterSubmit(data: z.infer<typeof SignUpFormSchema>) {
		setLoading(true);
		try {
			await signup({ email: data.email, name: data.name });
			onEmailSent(data.email);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : "Could not create account.",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Form {...signUpForm}>
				<form onSubmit={signUpForm.handleSubmit(onRegisterSubmit)}>
					<div className="flex w-full flex-col gap-4 text-center">
						<GoogleSignInButton disabled={loading} />
						<p className="text-[16px] font-normal text-[#1C1F22]">or</p>
						<FormField
							control={signUpForm.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Name"
											className="py-2.5 px-5 h-[45px] text-normal text-[16px] text-[#1C1F22]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={signUpForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="E-mail"
											className="py-2.5 px-5 h-[45px] text-normal text-[16px] text-[#1C1F22]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							size="lg"
							type="submit"
							className="rounded-full text-[16px] font-normal w-full"
							disabled={loading}
						>
							{loading ? "Sending…" : "Create account"}
						</Button>
					</div>
				</form>
			</Form>
			<DialogFooter className="justify-between items-center">
				<Button
					variant="ghost"
					size="lg"
					onClick={toggleMode}
					type="button"
					className="text-[#1C1F22] text-[16px] font-normal"
				>
					<ChevronLeft className="w-6 h-6" />
					<span>To go back</span>
				</Button>
			</DialogFooter>
		</>
	);
}
