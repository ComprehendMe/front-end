import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { requestDesktopNotificationPermission } from "@/lib/user-preferences";
import { Route as DashboardRoute } from "../../dashboard";

export const Route = createFileRoute("/dashboard/settings/notifications")({
	component: NotificationsPage,
});

function NotificationsPage() {
	const { t } = useTranslation();
	const { user } = DashboardRoute.useRouteContext();
	const { preferences, updateNotifications } = useUserPreferences(user.email);
	const { notifications } = preferences;
	const [timeoutInput, setTimeoutInput] = useState(
		String(notifications.pushTimeoutMinutes),
	);

	async function handleDesktopToggle(checked: boolean) {
		if (checked) {
			const allowed = await requestDesktopNotificationPermission();
			if (!allowed) {
				toast.error(t('dashboard.settings.notifications.toast_blocked'));
				return;
			}
		}
		updateNotifications({ desktopEnabled: checked });
		toast.success(t('dashboard.settings.notifications.toast_saved'));
	}

	function handleToggle(
		key: keyof typeof notifications,
		checked: boolean,
		skipToast?: boolean,
	) {
		if (key === "desktopEnabled") return;
		updateNotifications({ [key]: checked });
		if (!skipToast) toast.success(t('dashboard.settings.notifications.toast_saved'));
	}

	function handleTimeoutBlur() {
		const parsed = Number.parseInt(timeoutInput, 10);
		const minutes = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
		setTimeoutInput(String(minutes));
		updateNotifications({ pushTimeoutMinutes: minutes });
		toast.success(t('dashboard.settings.notifications.toast_saved'));
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.notifications.title')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								{t('dashboard.settings.notifications.desktop_label')}
							</p>
							<span className="font-regular text-gray-400 text-sm">
								{t('dashboard.settings.notifications.desktop_desc')}
							</span>
						</div>
						<Switch
							checked={notifications.desktopEnabled}
							onCheckedChange={(checked) => void handleDesktopToggle(checked)}
						/>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								{t('dashboard.settings.notifications.unread_badge_label')}
							</p>
							<span className="font-regular text-gray-400 text-sm">
								{t('dashboard.settings.notifications.unread_badge_desc')}
							</span>
						</div>
						<Switch
							checked={notifications.unreadBadgeEnabled}
							onCheckedChange={(checked) =>
								handleToggle("unreadBadgeEnabled", checked)
							}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							{t('dashboard.settings.notifications.push_timeout_label')}
						</p>
						<Input
							placeholder={t('dashboard.settings.notifications.push_timeout_placeholder')}
							value={timeoutInput}
							onChange={(e) => setTimeoutInput(e.target.value)}
							onBlur={handleTimeoutBlur}
						/>
					</div>
				</div>
			</div>
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.notifications.email_section')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								{t('dashboard.settings.notifications.email_communication_label')}
							</p>
							<span className="font-regular text-gray-400 text-sm">
								{t('dashboard.settings.notifications.email_communication_desc')}
							</span>
						</div>
						<Switch
							checked={notifications.emailCommunication}
							onCheckedChange={(checked) =>
								handleToggle("emailCommunication", checked)
							}
						/>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								{t('dashboard.settings.notifications.email_announcements_label')}
							</p>
							<span className="font-regular text-gray-400 text-sm">
								{t('dashboard.settings.notifications.email_announcements_desc')}
							</span>
						</div>
						<Switch
							checked={notifications.emailAnnouncements}
							onCheckedChange={(checked) =>
								handleToggle("emailAnnouncements", checked)
							}
						/>
					</div>
				</div>
			</div>
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">{t('dashboard.settings.notifications.sounds_section')}</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								{t('dashboard.settings.notifications.sounds_label')}
							</p>
							<span className="font-regular text-gray-400 text-sm">
								{t('dashboard.settings.notifications.sounds_desc')}
							</span>
						</div>
						<Switch
							checked={notifications.soundsDisabled}
							onCheckedChange={(checked) =>
								handleToggle("soundsDisabled", checked)
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
