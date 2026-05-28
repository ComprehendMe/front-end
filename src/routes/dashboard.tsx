import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ApiError, getMe, recordActivity, type MeUser } from "@/lib/api";
import { loadUserPreferences } from "@/lib/user-preferences";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		try {
			const user = await getMe();
			if (!user.onboardingCompleted) {
				throw redirect({ to: "/auth/onboarding" });
			}
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

	const IDLE_TIMEOUT_MS = 5 * 60_000;
	const isActiveRef = useRef(true);

	useEffect(() => {
		let idleTimer: ReturnType<typeof setTimeout>;

		function resetIdle() {
			isActiveRef.current = true;
			clearTimeout(idleTimer);
			idleTimer = setTimeout(() => {
				isActiveRef.current = false;
			}, IDLE_TIMEOUT_MS);
		}

		const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
		for (const ev of events) {
			window.addEventListener(ev, resetIdle, { passive: true });
		}

		resetIdle();

		return () => {
			clearTimeout(idleTimer);
			for (const ev of events) {
				window.removeEventListener(ev, resetIdle);
			}
		};
	}, []);

	useEffect(() => {
		void recordActivity().catch(() => undefined);
		const interval = setInterval(() => {
			if (isActiveRef.current) {
				void recordActivity().catch(() => undefined);
			}
		}, 60_000);
		return () => clearInterval(interval);
	}, []);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="px-6 py-6 lg:px-7">
				<DashboardHeader user={user} />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
