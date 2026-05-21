import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ApiError, getMe, type MeUser } from "@/lib/api";
import { loadUserPreferences } from "@/lib/user-preferences";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		try {
			const user = await getMe();
			return { user };
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) {
				throw redirect({ to: "/" });
			}
			throw e;
		}
	},
	component: RouteComponent,
});

export type DashboardContext = { user: MeUser };

function RouteComponent() {
	const { user } = Route.useRouteContext();

	useEffect(() => {
		document.documentElement.lang = "en";
		loadUserPreferences(user.email);
	}, [user.email]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="px-5 py-[30px]">
				<DashboardHeader user={user} />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
