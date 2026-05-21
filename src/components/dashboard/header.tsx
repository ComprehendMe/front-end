import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardSearch } from '@/components/dashboard/dashboard-search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
		<header className="flex w-full items-center gap-8">
			<DashboardSearch patients={patients} />
			<div className="flex w-full max-w-3xs shrink-0 items-center gap-5">
				<Button
					size="icon-lg"
					className="rounded-full border-[#1C1F22]/15 text-gray-500"
					variant="outline"
				>
					<Bell size={22} />
				</Button>
				<div className="flex items-center gap-2.5">
					<Avatar className="size-10">
						{user.avatar ? (
							<AvatarImage src={user.avatar} alt={displayName} />
						) : null}
						<AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="whitespace-nowrap text-[16px] font-medium text-[#1C1F22]">
						{displayName}
					</span>
				</div>
			</div>
		</header>
	);
}
