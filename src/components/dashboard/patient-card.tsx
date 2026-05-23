import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
	getPatientBadgeVariant,
	getPatientImageUrl,
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

	return (
		<div className={cn('flex flex-col justify-between gap-4', className)}>
			<div className="flex justify-center rounded-xl bg-primary/10 py-4">
				<Avatar className="size-24">
					<AvatarImage
						src={getPatientImageUrl(patientName)}
						alt={patientName}
						className="object-cover"
					/>
					<AvatarFallback className="bg-primary/20 text-2xl font-semibold text-primary">
						{initials}
					</AvatarFallback>
				</Avatar>
			</div>
			<Badge variant={badgeVariant} />
			<div className="h-1 w-full overflow-hidden rounded-full bg-[#E8EEF2]">
				<div
					className="h-full rounded-full bg-primary transition-all"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<p className="line-clamp-3 font-semibold text-xl text-foreground">
					{problem}
				</p>
				<span className="font-semibold text-muted-foreground text-sm">
					{subtitle ?? patientName}
				</span>
			</div>
		</div>
	);
}
