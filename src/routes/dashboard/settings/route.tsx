import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, Globe, User } from "lucide-react";
import { ListTab } from "@/components/dashboard/tabs-list";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings")({
	component: DashboardRoute,
});

function DashboardRoute() {
	return (
		<main className="py-4 sm:py-6 lg:py-7">
			<div className="bg-white border border-[#1C1F22]/15 rounded-t-[20px]">
				<h3 className="mx-4 my-6 font-semibold text-2xl sm:mx-6 sm:my-8 lg:ml-[30px] lg:my-[38px]">
					Settings
				</h3>
				<Separator />
				<div className="flex h-full w-full flex-col lg:flex-row lg:justify-between">
					<aside className="w-full space-y-6 px-4 py-5 sm:px-6 lg:max-w-[260px] lg:space-y-10 lg:py-8 lg:pl-[30px] lg:pr-9">
						<ListTab
							tabs={{
								title: "Workspace Settings",
								items: [
									{
										name: "Account",
										value: "/",
										icon: <User />,
									},
									{
										name: "Notifications",
										value: "/notifications",
										icon: <Bell />,
									},
									{
										name: "Language & time",
										value: "/language",
										icon: <Globe />,
									},
									{
										name: "Billing",
										value: "/billing",
										icon: (
											<img
												src="/billing.png"
												alt=""
												className="h-4 w-4 opacity-80"
											/>
										),
									},
								],
							}}
							url="/dashboard/settings"
						/>
					</aside>
					<div className="w-full min-w-0">
						<Outlet />
					</div>
				</div>
			</div>
		</main>
	);
}
