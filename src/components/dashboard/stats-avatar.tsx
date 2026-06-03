import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/user-display';
import type { MeUser } from '@/lib/api';

type StatsAvatarProps = {
	user: MeUser;
	streak: number;
	ringProgress: number;
};

export function StatsAvatar({ user, streak, ringProgress }: StatsAvatarProps) {
	const initials = getInitials(user);
	const radius = 70;
	const stroke = 5.5;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (ringProgress / 100) * circumference;

	return (
		<div className="relative mx-auto size-[clamp(8rem,40vw,10.5rem)]">
			<svg
				className="absolute inset-0 -rotate-90"
				width="100%"
				height="100%"
				viewBox="0 0 168 168"
				aria-hidden="true"
			>
				<circle
					cx="84"
					cy="84"
					r={radius}
					fill="transparent"
					className="stroke-dashboard-border"
					strokeWidth={stroke}
				/>
				<circle
					cx="84"
					cy="84"
					r={radius}
					fill="transparent"
					stroke="#1497D2"
					strokeWidth={stroke}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="transition-all duration-700"
				/>
			</svg>

			<div className="absolute inset-[12.5%] overflow-hidden rounded-full border-4 border-white shadow-md">
				<Avatar className="h-full w-full">
					{user.avatar ? (
						<AvatarImage src={user.avatar} alt="" className="object-cover" loading="lazy" />
					) : null}
					<AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
						{initials}
					</AvatarFallback>
				</Avatar>
			</div>

			<div className="absolute top-2 right-1 flex items-center gap-1 rounded-full bg-[#D6EBF7] px-2.5 py-1 shadow-sm">
				<span className="text-sm font-bold text-[#0978AA]">{streak}</span>
				<img src="/logo.svg" alt="" className="h-5 w-5" aria-hidden loading="lazy" />
			</div>
		</div>
	);
}
