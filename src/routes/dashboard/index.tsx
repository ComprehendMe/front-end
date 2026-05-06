import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ContinueSection } from "@/components/dashboard/continue-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

const chartData = [
	{ month: "January", desktop: 186 },
	{ month: "February", desktop: 305 },
	{ month: "March", desktop: 237 },
	{ month: "April", desktop: 73 },
	{ month: "May", desktop: 209 },
	{ month: "June", desktop: 214 },
];

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

function DashboardPage() {
	return (
		<main className="grid grid-cols-3 gap-5 mt-8">
			<div className="flex gap-7 flex-col col-span-2 w-full">
				<div className="bg-linear-to-bl from-[#0978AA] to-[#1497D2] w-full px-8 py-10 rounded-3xl text-white">
					<div className="space-y-3">
						<h2 className="text-2xl font-semibold">Access Premium Patients</h2>
						<p className="font-normal text-lg">
							Advanced clinical cases for specialized training.
						</p>
						<Button
							className="bg-white/90 text-primary text-lg font-medium rounded-full hover:bg-white"
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
					<h2 className="text-[16px] font-semibold text-black">Statistic</h2>
					<div className="flex justify-center gap-6 flex-col text-center">
						<div className="relative">
							<div className="flex justify-center p-14">
								<Avatar className="size-36">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</div>
							<div className="-mt-2">
								<h3 className="text-lg font-semibold">Good morning Joana</h3>
								<p className="text-gray-500 font-medium text-xs">
									Continue your learning to achieve your target!
								</p>
							</div>
						</div>
						<ChartContainer config={chartConfig}>
							<BarChart accessibilityLayer data={chartData}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="month"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									tickFormatter={(value) => value.slice(0, 3)}
								/>
								<YAxis
									dataKey="desktop"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
							</BarChart>
						</ChartContainer>
						<div className="space-y-3.5">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">Friends</h3>
								<Button
									size="icon-lg"
									className="rounded-full border-primary text-primary hover:bg-primary/10"
									variant="outline"
								>
									<Plus />
								</Button>
							</div>
							<div className="py-4 gap-5 px-3.5 flex flex-col bg-[#F0F5FA] rounded-xl">
								<div className="space-y-3">
									<div className="flex gap-2 items-center">
										<Avatar>
											<AvatarImage src="https://github.com/shadcn.png" />
										</Avatar>
										<span className="text-sm font-medium">Pedro Soares</span>
									</div>
									<Separator />
									<div className="flex gap-2 items-center">
										<Avatar>
											<AvatarImage src="https://github.com/shadcn.png" />
										</Avatar>
										<span className="text-sm font-medium">Pedro Soares</span>
									</div>
									<Separator />
									<div className="flex gap-2 items-center">
										<Avatar>
											<AvatarImage src="https://github.com/shadcn.png" />
										</Avatar>
										<span className="text-sm font-medium">Pedro Soares</span>
									</div>
								</div>
								<Button
									size="lg"
									className="bg-primary/15 text-primary hover:bg-primary/20 font-medium text-lg"
								>
									See All
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
