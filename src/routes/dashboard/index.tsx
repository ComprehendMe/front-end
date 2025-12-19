import { AppSidebar } from "@/components/app-sidebar";
import { ContinueSection } from "@/components/dashboard/continue-section";
import { DashboardHeader } from "@/components/dashboard/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<>
			<AppSidebar />
			<SidebarInset className="px-5 py-8">
				<DashboardHeader />
				<main className="grid grid-cols-3 gap-5 mt-8">
					<div className="flex gap-7 flex-col col-span-2 w-full">
						<div className="bg-linear-to-bl from-[#0978AA] to-[#1497D2] w-full px-8 py-10 rounded-3xl text-white">
							<div className="space-y-3">
								<h2 className="text-2xl font-semibold">
									Access Premium Patients
								</h2>
								<p className="font-normal text-lg">
									Advanced clinical cases for specialized training.
								</p>
								<Button
									className="bg-gray-100 text-blue-500 text-lg font-medium rounded-full"
									size="lg"
								>
									Go premium!
								</Button>
							</div>
						</div>
						<div className="flex gap-4 items-center w-full">
							<div className="flex gap-4 w-full items-center bg-white p-2.5 rounded-xl shadow-lg shadow-black/5">
								<Avatar className="size-14">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-black">
										Mariana Soares
									</span>
									<span className="text-xs font-normal text-gray-500">
										Problems at School/Work
									</span>
								</div>
							</div>
							<div className="flex gap-4 w-full items-center bg-white p-2.5 rounded-xl shadow-lg shadow-black/5">
								<Avatar className="size-14">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-black">
										Mariana Soares
									</span>
									<span className="text-xs font-normal text-gray-500">
										Problems at School/Work
									</span>
								</div>
							</div>
							<div className="flex gap-4 w-full items-center bg-white p-2.5 rounded-xl shadow-lg shadow-black/5">
								<Avatar className="size-14">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-black">
										Mariana Soares
									</span>
									<span className="text-xs font-normal text-gray-500">
										Problems at School/Work
									</span>
								</div>
							</div>
						</div>
						<div className="py-2">
							<ContinueSection />
						</div>
					</div>
					<div className="w-full">
						<div className="min-h-screen border bg-white rounded-3xl px-3.5 py-4">
							<h2 className="text-[16px] font-semibold text-black">
								Statistic
							</h2>
							<div className="flex justify-center flex-col text-center">
								<div className="relative">
									<div className="flex justify-center p-14">
										<Avatar className="size-36">
											<AvatarImage src="https://github.com/shadcn.png" />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</div>
									<div className="-mt-2">
										<h3 className="text-lg font-semibold">
											Good morning Joana
										</h3>
										<p className="text-gray-500 font-medium text-xs">
											Continue your learning to achieve your target!
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</SidebarInset>
		</>
	);
}
