import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { requestDesktopNotificationPermission } from '@/lib/user-preferences';
import { Route as DashboardRoute } from '../../dashboard';

export const Route = createFileRoute('/dashboard/settings/notifications')({
	component: NotificationsPage,
});

function NotificationsPage() {
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
				toast.error(
					'Desktop notifications are blocked. Enable them in your browser settings.',
				);
				return;
			}
		}
		updateNotifications({ desktopEnabled: checked });
		toast.success('Notification settings saved.');
	}

	function handleToggle(
		key: keyof typeof notifications,
		checked: boolean,
		skipToast?: boolean,
	) {
		if (key === 'desktopEnabled') return;
		updateNotifications({ [key]: checked });
		if (!skipToast) toast.success('Notification settings saved.');
	}

	function handleTimeoutBlur() {
		const parsed = Number.parseInt(timeoutInput, 10);
		const minutes = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
		setTimeoutInput(String(minutes));
		updateNotifications({ pushTimeoutMinutes: minutes });
		toast.success('Notification settings saved.');
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">Notifications</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								Enable desktop notifications
							</p>
							<span className="font-regular text-gray-400 text-sm">
								Receive notifications for messages, sessions, and updates.
							</span>
						</div>
						<Switch
							checked={notifications.desktopEnabled}
							onCheckedChange={(checked) => void handleDesktopToggle(checked)}
						/>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								Enable unread notification badge
							</p>
							<span className="font-regular text-gray-400 text-sm">
								Show an unread indicator in the browser tab title.
							</span>
						</div>
						<Switch
							checked={notifications.unreadBadgeEnabled}
							onCheckedChange={(checked) =>
								handleToggle('unreadBadgeEnabled', checked)
							}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							Push notification timeout
						</p>
						<Input
							placeholder="10 minutes"
							value={timeoutInput}
							onChange={(e) => setTimeoutInput(e.target.value)}
							onBlur={handleTimeoutBlur}
						/>
					</div>
				</div>
			</div>
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					Email notifications
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								Communication emails
							</p>
							<span className="font-regular text-gray-400 text-sm">
								Receive emails for messages and session activity.
							</span>
						</div>
						<Switch
							checked={notifications.emailCommunication}
							onCheckedChange={(checked) =>
								handleToggle('emailCommunication', checked)
							}
						/>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								Announcements and updates
							</p>
							<span className="font-regular text-gray-400 text-sm">
								Receive emails about product updates and improvements.
							</span>
						</div>
						<Switch
							checked={notifications.emailAnnouncements}
							onCheckedChange={(checked) =>
								handleToggle('emailAnnouncements', checked)
							}
						/>
					</div>
				</div>
			</div>
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">Sounds</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								Disable all notification sounds
							</p>
							<span className="font-regular text-gray-400 text-sm">
								Mute sounds for messages and session notifications.
							</span>
						</div>
						<Switch
							checked={notifications.soundsDisabled}
							onCheckedChange={(checked) =>
								handleToggle('soundsDisabled', checked)
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
