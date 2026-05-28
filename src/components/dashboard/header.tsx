import { useEffect, useState } from 'react';
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
	const displayName = getDisplayName(user);
	const initials = getInitials(user);

	useEffect(() => {
		listPatients()
			.then((list) => setPatients(list))
			.catch(() => setPatients([]));
	}, []);

	return (
		<header className="flex w-full items-center gap-7">
			<DashboardSearch patients={patients} />
			<div className="flex w-full max-w-[290px] shrink-0 items-center justify-end gap-5">
				<NotificationBell />
				<div className="flex items-center gap-2.5">
					<Avatar className="size-10">
						{user.avatar ? (
							<AvatarImage src={user.avatar} alt={displayName} />
						) : null}
						<AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="text-[#d6dde3] text-lg">|</span>
					<span className="whitespace-nowrap text-[16px] font-medium text-[#1C1F22]">
						{displayName}
					</span>
				</div>
			</div>
		</header>
	);
}
