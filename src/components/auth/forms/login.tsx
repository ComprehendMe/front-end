import { zodResolver } from "@hookform/resolvers/zod";
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
import { LoginFormSchema } from "../auth";

export default function LoginForm({ toggleMode }: { toggleMode: () => void }) {
	const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: { email: "" },
	});

	function onLoginSubmit(_data: z.infer<typeof LoginFormSchema>) {}

	return (
		<>
			<Form {...loginForm}>
				<form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
					<div className="flex w-full flex-col gap-[19px] text-center">
						<div className="flex flex-col w-full gap-4 items-center">
							<Button
								variant="outline"
								size="lg"
								className="rounded-full w-full"
							>
								<Google className="w-6 h-6" />
								<p className="font-normal text-[16px] text-[#1C1F22]">
									Continue with Google
								</p>
							</Button>
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
						<Button size="lg" type="submit" className="rounded-full h-[45px]">
							Continue with email
						</Button>
					</div>
				</form>
			</Form>
			<DialogFooter className="justify-center">
				<Button variant="link" onClick={toggleMode}>
					<span className="text-blue-500 text-[16px] font-normal">
						Create account
					</span>
				</Button>
			</DialogFooter>
		</>
	);
}
