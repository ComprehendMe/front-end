import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
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
import { Google } from "@/components/ui/svgs/google";
import { SignUpFormSchema } from "../auth";

export default function SignUpForm({
	toggleMode,
	setMode,
}: {
	setMode: (mode: "login" | "register" | "steps") => void;
	toggleMode: () => void;
}) {
	const signUpForm = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { name: "", email: "" },
	});

	function onRegisterSubmit(_data: z.infer<typeof SignUpFormSchema>) {}

	return (
		<>
			<Form {...signUpForm}>
				<form onSubmit={signUpForm.handleSubmit(onRegisterSubmit)}>
					<div className="flex w-full flex-col gap-4 text-center">
						<Button variant="outline" size="lg" className="rounded-full w-full">
							<Google className="w-6 h-6" />
							<p className="font-normal text-[16px] text-[#1C1F22]">
								Continue with Google
							</p>
						</Button>
						<p className="text-[16px] font-normal text-[#1C1F22]">or</p>
						<FormField
							control={signUpForm.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Nome"
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
					</div>
				</form>
			</Form>
			<DialogFooter className="justify-between items-center">
				<Button
					variant="ghost"
					size="lg"
					onClick={toggleMode}
					className="text-[#1C1F22] text-[16px] font-normal"
				>
					<ChevronLeft className="w-6 h-6" />
					<span>To go back</span>
				</Button>
				<Button
					size="lg"
					type="submit"
					onClick={() => setMode("steps")}
					className="rounded-full text-[16px] font-normal"
				>
					Continue
				</Button>
			</DialogFooter>
		</>
	);
}
