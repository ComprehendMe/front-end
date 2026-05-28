import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, Globe, User } from "lucide-react";
import { ListTab } from "@/components/dashboard/tabs-list";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings")({
	component: DashboardRoute,
});

function DashboardRoute() {
	return (
		<main className="bg-[var(--dashboard-canvas-alt)] py-fluid-section">
			<div className="bg-white border border-[#1C1F22]/15 rounded-t-[20px]">
				<h3 className="mx-fluid-container my-fluid-lg font-semibold text-fluid-2xl">
					Settings
				</h3>
				<Separator />
				<div className="flex h-full w-full flex-col lg:flex-row lg:justify-between">
					<aside className="w-full space-y-6 px-fluid-container py-fluid-md lg:max-w-[260px] lg:space-y-10 lg:py-8 lg:pl-[30px] lg:pr-9">
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
