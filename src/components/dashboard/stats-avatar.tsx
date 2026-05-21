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
	const radius = 68;
	const stroke = 5;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (ringProgress / 100) * circumference;

	return (
		<div className="relative mx-auto h-[160px] w-[160px]">
			<svg
				className="absolute inset-0 -rotate-90"
				width="160"
				height="160"
				aria-hidden
			>
				<circle
					cx="80"
					cy="80"
					r={radius}
					fill="transparent"
					stroke="#E2E8F0"
					strokeWidth={stroke}
				/>
				<circle
					cx="80"
					cy="80"
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

			<div className="absolute inset-[18px] overflow-hidden rounded-full border-4 border-white shadow-md">
				<Avatar className="h-full w-full">
					{user.avatar ? (
						<AvatarImage src={user.avatar} alt="" className="object-cover" />
					) : null}
					<AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
						{initials}
					</AvatarFallback>
				</Avatar>
			</div>

			<div className="absolute -top-1 right-2 flex items-center gap-1 rounded-full bg-[#D6EBF7] px-2.5 py-1 shadow-sm">
				<span className="text-sm font-bold text-[#0978AA]">{streak}</span>
				<img src="/logo.svg" alt="" className="h-5 w-5" aria-hidden />
			</div>
		</div>
	);
}
