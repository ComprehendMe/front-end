import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Google } from "../ui/svgs/google";
import { LoginFormSchema, SignUpFormSchema } from "./auth";

export default function AuthDialog() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const [showPassword, setShowPassword] = useState(false);

	const toggleMode = () => setMode(mode === "login" ? "register" : "login");
	const togglePassword = () => setShowPassword(!showPassword);

	const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: { email: "" },
	});

	const signUpForm = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { name: "", email: "", password: "" },
	});

	function onSubmit(_data: z.infer<typeof LoginFormSchema>) {}

	return (
		<Dialog modal={true}>
			<DialogTrigger asChild>
				<Button className="rounded-full px-6 text-white">To start</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="sm:max-w-[450px] gap-6">
				<DialogHeader className=" items-center">
					<DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
						Welcome to CogniAI
					</DialogTitle>
				</DialogHeader>
				{mode === "login" ? (
					<Form {...loginForm}>
						<form onSubmit={loginForm.handleSubmit(onSubmit)}>
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
								<Button
									size="lg"
									type="submit"
									className="rounded-full h-[45px]"
								>
									Continue with email
								</Button>
							</div>
						</form>
					</Form>
				) : (
					<Form {...signUpForm}>
						<form onSubmit={signUpForm.handleSubmit(onSubmit)}>
							<div className="flex w-full flex-col gap-4 text-center">
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
								<FormField
									control={signUpForm.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className="relative">
													<Input
														placeholder="Password"
														className="py-2.5 px-5 h-[45px] text-normal text-[16px] text-[#1C1F22]"
														type={showPassword ? "text" : "password"}
														{...field}
													/>
													<Button
														variant="ghost"
														size="icon"
														onClick={togglePassword}
														className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
													>
														{showPassword ? <EyeOffIcon /> : <EyeIcon />}
														<span className="sr-only">
															{showPassword ? "Hide password" : "Show password"}
														</span>
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
				)}
				{mode === "login" ? (
					<DialogFooter className="justify-center">
						<Button variant="link" onClick={toggleMode}>
							<span className="text-blue-500 text-[16px] font-normal">
								Create account
							</span>
						</Button>
					</DialogFooter>
				) : (
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
							className="rounded-full text-[16px] font-normal"
						>
							Register
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
