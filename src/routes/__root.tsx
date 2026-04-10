import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import type { AuthUser } from "@/store/auth";
import { setUser } from "@/store/auth";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	useEffect(() => {
		const bootstrapSession = async () => {
			try {
				const user = await api<AuthUser>("/users/@me");
				setUser(user);
			} catch {
				setUser(null);
			}
		};

		void bootstrapSession();
	}, []);

	return (
		<>
			<Outlet />
			<Toaster />
		</>
	);
}
