import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	ApiError,
	createChat,
	type Chat,
	type Patient,
} from '@/lib/api';
import { getPatientAvatar } from '@/lib/patient-avatar';
import { getPatientBadgeVariant, getPatientIndex } from '@/lib/patient-assets';

function formatDate(iso: string, t: (key: string, options?: Record<string, unknown>) => string) {
	const date = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (diffDays === 0) return t('components.dashboard-sections.date_today');
	if (diffDays === 1) return t('components.dashboard-sections.date_yesterday');
	if (diffDays < 7) return t('components.dashboard-sections.date_days_ago', { days: diffDays });
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type RecentConversationsProps = {
	chats: Chat[];
};

export function RecentConversations({ chats }: RecentConversationsProps) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [startingId, setStartingId] = useState<string | null>(null);

	const recent = [...chats]
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		)
		.slice(0, 4);

	async function handleNewChat(patientId: string) {
		setStartingId(patientId);
		try {
			const chat = await createChat(patientId);
			await navigate({
				to: '/dashboard/chat/$chatId',
				params: { chatId: chat.id },
			});
		} catch (e) {
			toast.error(
				e instanceof ApiError
					? e.message
					: t('components.dashboard-sections.toast_error'),
			);
		} finally {
			setStartingId(null);
		}
	}

	return (
		<section className="space-y-3">
			<h2 className="text-fluid-3xl font-semibold leading-[1.1] text-[#1C1F22]">
				{t('components.dashboard-sections.recent_title')}
			</h2>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{recent.map((chat) => (
					<div
						key={chat.id}
						className="rounded-[18px] border border-[#E8EDF2] bg-white p-4 shadow-xs"
					>
						<div className="mb-3 flex items-center gap-3">
							<Avatar className="h-10 w-10 shrink-0">
								<AvatarImage
									src={getPatientAvatar(chat.patient.name)}
									alt=""
									loading="lazy"
								/>
								<AvatarFallback>
									{chat.patient.name[0]}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold text-[#1C1F22]">
									{chat.patient.name}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{chat.patient.problem}
								</p>
							</div>
							<span className="shrink-0 text-xs text-muted-foreground">
								{formatDate(chat.updatedAt, t)}
							</span>
						</div>
						<div className="flex gap-2">
							<Link
								to="/dashboard/review/$chatId"
								params={{ chatId: chat.id }}
								className="flex-1"
							>
								<Button
									variant="outline"
									size="sm"
									className="w-full rounded-full text-xs"
								>
									{t('components.dashboard-sections.review_report')}
								</Button>
							</Link>
							<Button
								size="sm"
								className="w-full rounded-full bg-[#1497D2] text-xs hover:bg-[#2285B3]"
								disabled={startingId === chat.patientId}
								onClick={() => void handleNewChat(chat.patientId)}
							>
								{t('components.dashboard-sections.new_conversation')}
							</Button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

type StartLearningSectionProps = {
	patients: Patient[];
	startingId: string | null;
	onStart: (patient: Patient) => void;
};

export function StartLearningSection({
	patients,
	startingId,
	onStart,
}: StartLearningSectionProps) {
	return (
		<section className="space-y-3">
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{patients.map((patient) => {
					const badgeVariant = getPatientBadgeVariant(
						getPatientIndex(patients, patient.id),
					);

					return (
						<button
							key={patient.id}
							type="button"
							disabled={startingId !== null}
							onClick={() => onStart(patient)}
							className="flex items-center gap-3 rounded-[18px] border border-[#E8EDF2] bg-white p-4 shadow-xs text-left transition hover:shadow-sm hover:scale-[1.01] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<div className="h-12 w-12 shrink-0 rounded-xl bg-[#E6F1F6] p-1">
								<Avatar className="h-full w-full rounded-lg">
									<AvatarImage
										src={getPatientAvatar(patient.name)}
										alt={patient.name}
										className="object-cover"
										loading="lazy"
									/>
								</Avatar>
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-fluid-sm font-bold leading-tight text-[#1C1F22]">
									{patient.name}
								</p>
								<p className="mt-0.5 truncate text-fluid-xs font-medium text-muted-foreground">
									{patient.problem}
								</p>
								<Badge
									variant={badgeVariant}
									className="mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
								>
									{patient.difficulty}
								</Badge>
							</div>
						</button>
					);
				})}
			</div>
		</section>
	);
}
