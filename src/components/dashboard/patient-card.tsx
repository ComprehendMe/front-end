import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getPatientAvatar } from '@/lib/patient-avatar';
import {
	getPatientBadgeVariant,
	getPatientProgressPercent,
} from '@/lib/patient-assets';

type PatientCardContentProps = {
	patientIndex: number;
	patientId: string;
	patientName: string;
	problem: string;
	subtitle?: string;
	className?: string;
};

export function PatientCardContent({
	patientIndex,
	patientId,
	patientName,
	problem,
	subtitle,
	className,
}: PatientCardContentProps) {
	const progress = getPatientProgressPercent(patientId);
	const badgeVariant = getPatientBadgeVariant(patientIndex);
	const initials = patientName
		.split(' ')
		.map((n) => n[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();

	const bgColors = [
		'bg-[#E6F4FA]', // Blue
		'bg-[#F0E6FA]', // Purple
		'bg-[#F4FAE6]', // Green
	];
	const bgColor = bgColors[patientIndex % bgColors.length];

	return (
		<div className={cn('flex flex-col gap-4', className)}>
			<div className={cn('flex justify-center rounded-[18px] py-fluid-sm', bgColor)}>
				<Avatar className="size-[clamp(4rem,16vw,6rem)] shadow-xs border-2 border-white/20">
					<AvatarImage
						src={getPatientAvatar(patientName)}
						alt={patientName}
						className="object-cover"
					/>
					<AvatarFallback className="bg-white/50 text-fluid-xl font-bold text-[#1497D2]">
						{initials}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<Badge variant={badgeVariant} className="font-semibold px-2.5 py-0.5 rounded-full text-fluid-xs uppercase tracking-wide" />
				</div>
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8EEF2]">
					<div
						className="h-full rounded-full bg-[#1497D2] transition-all"
						style={{ width: `${progress}%` }}
					/>
				</div>
				<div className="flex flex-col gap-1 mt-0.5">
					<p className="line-clamp-2 text-fluid-base leading-[1.3] font-semibold text-[#1C1F22]">
						{problem}
					</p>
					<span className="font-semibold text-muted-foreground text-fluid-sm">
						{subtitle ?? patientName}
					</span>
				</div>
			</div>
		</div>
	);
}
