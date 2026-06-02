import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Bell, Globe, User, Users } from "lucide-react";
import { ListTab } from "@/components/dashboard/tabs-list";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings")({
	validateSearch: (search: Record<string, unknown>) => ({
		ec: typeof search.ec === "string" ? search.ec : undefined,
	}),
	component: DashboardRoute,
});

function DashboardRoute() {
	const { ec } = Route.useSearch();
	const navigate = useNavigate();

	useEffect(() => {
		if (ec === "success") {
			toast.success("Email changed successfully.");
		} else if (ec === "expired") {
			toast.error("Verification link expired or invalid.");
		}
		if (ec) {
			navigate({ to: "/dashboard/settings", search: { ec: undefined }, replace: true });
		}
	}, [ec, navigate]);
	return (
		<main className="bg-[var(--dashboard-canvas-alt)] py-6 sm:py-8 lg:py-12">
			<div className="bg-white border border-[#1C1F22]/15 rounded-[20px]">
				<h3 className="mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 lg:mt-8 mb-4 sm:mb-6 lg:mb-8 font-semibold text-2xl">
					Settings
				</h3>
				<Separator />
				<div className="flex h-full w-full flex-col lg:flex-row lg:justify-between">
					<aside className="w-full space-y-8 px-4 py-5 sm:px-6 sm:py-6 lg:max-w-[260px] lg:py-8 lg:pl-[30px] lg:pr-9">
						<ListTab
							tabs={{
								title: "General Settings",
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
								],
							}}
							url="/dashboard/settings"
						/>
						<ListTab
							tabs={{
								title: "Workspace Settings",
								items: [
									{
										name: "Friends",
										value: "/friends",
										icon: <Users />,
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
