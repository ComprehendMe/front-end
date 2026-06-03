import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();

	useEffect(() => {
		if (ec === "success") {
			toast.success(t('dashboard.settings.route.toast_email_changed'));
		} else if (ec === "expired") {
			toast.error(t('dashboard.settings.route.toast_verification_expired'));
		}
		if (ec) {
			navigate({ to: "/dashboard/settings", search: { ec: undefined }, replace: true });
		}
	}, [ec, navigate, t]);
	return (
		<main className="bg-[var(--dashboard-canvas-alt)] py-6 sm:py-8 lg:py-12">
			<div className="bg-white border border-[#1C1F22]/15 rounded-[20px]">
				<h3 className="mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 lg:mt-8 mb-4 sm:mb-6 lg:mb-8 font-semibold text-2xl">
					{t('dashboard.settings.route.title')}
				</h3>
				<Separator />
				<div className="flex h-full w-full flex-col lg:flex-row lg:justify-between">
					<aside className="w-full space-y-8 px-4 py-5 sm:px-6 sm:py-6 lg:max-w-[260px] lg:py-8 lg:pl-[30px] lg:pr-9">
						<ListTab
							tabs={{
								title: t('dashboard.settings.route.general_section'),
								items: [
									{
										name: t('dashboard.settings.route.tab_account'),
										value: "/",
										icon: <User />,
									},
									{
										name: t('dashboard.settings.route.tab_notifications'),
										value: "/notifications",
										icon: <Bell />,
									},
									{
										name: t('dashboard.settings.route.tab_language_time'),
										value: "/language",
										icon: <Globe />,
									},
								],
							}}
							url="/dashboard/settings"
						/>
						<ListTab
							tabs={{
								title: t('dashboard.settings.route.workspace_section'),
								items: [
									{
										name: t('dashboard.settings.route.tab_friends'),
										value: "/friends",
										icon: <Users />,
									},
									{
										name: t('dashboard.settings.route.tab_billing'),
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
