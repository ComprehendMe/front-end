import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSearch } from '@/components/dashboard/dashboard-search';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { listPatients, type MeUser, type Patient } from '@/lib/api';
import { getDisplayName, getInitials } from '@/lib/user-display';

type DashboardHeaderProps = {
	user: MeUser;
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
	const [patients, setPatients] = useState<Patient[]>([]);
	const { t } = useTranslation();
	const displayName = getDisplayName(user, t('dashboard.settings.account.add_your_name'));
	const initials = getInitials(user);

	useEffect(() => {
		listPatients()
			.then((list) => setPatients(list))
			.catch(() => setPatients([]));
	}, []);

	return (
		<header className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-7">
			<DashboardSearch patients={patients} />
			<div className="flex w-full items-center justify-end gap-4 md:max-w-[290px] md:shrink-0 md:gap-5">
				<NotificationBell />
				<div className="flex items-center gap-2.5">
					<Avatar className="size-10">
						{user.avatar ? (
							<AvatarImage src={user.avatar} alt={t('dashboard.layout.header_user_avatar_alt', { displayName })} />
						) : null}
						<AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="text-[#d6dde3] text-lg">{t('dashboard.layout.header_user_separator')}</span>
					<span className="whitespace-nowrap text-fluid-sm font-medium text-[#1C1F22]">
						{displayName}
					</span>
				</div>
			</div>
		</header>
	);
}
