import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ContinueSection } from '@/components/dashboard/continue-section';
import { PatientsCarousel } from '@/components/dashboard/patients-carousel';
import { StatsAvatar } from '@/components/dashboard/stats-avatar';
import { WeeklyMinutesChart } from '@/components/dashboard/weekly-minutes-chart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	ApiError,
	createChat,
	getDashboardStats,
	listChats,
	listPatients,
	recordActivity,
	type Chat,
	type DashboardStats,
	type Patient,
} from '@/lib/api';
import { getTimeGreeting } from '@/lib/format-message-time';
import { getDisplayName } from '@/lib/user-display';
import { Route as DashboardRoute } from '../dashboard';

export const Route = createFileRoute('/dashboard/')({
	component: DashboardPage,
});

function DashboardPage() {
	const { user } = DashboardRoute.useRouteContext();
	const navigate = useNavigate();
	const [patients, setPatients] = useState<Patient[]>([]);
	const [recentChats, setRecentChats] = useState<Chat[]>([]);
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loadingPatients, setLoadingPatients] = useState(true);
	const [startingId, setStartingId] = useState<string | null>(null);

	const displayName = getDisplayName(user);
	const greeting = getTimeGreeting();

	useEffect(() => {
		Promise.all([listPatients(), listChats(), getDashboardStats()])
			.then(([patientList, chatList, dashboardStats]) => {
				const sorted = [...patientList].sort((a, b) =>
					a.name.localeCompare(b.name),
				);
				setPatients(sorted);
				setRecentChats(chatList.slice(0, 6));
				setStats(dashboardStats);
			})
			.catch((e) => {
				toast.error(
					e instanceof ApiError
						? e.message
						: 'Could not load dashboard data.',
				);
			})
			.finally(() => setLoadingPatients(false));
	}, []);

	useEffect(() => {
		void recordActivity().catch(() => undefined);
		const interval = setInterval(() => {
			void recordActivity().catch(() => undefined);
		}, 60_000);
		return () => clearInterval(interval);
	}, []);

	async function startSession(patient: Patient) {
		setStartingId(patient.id);
		try {
			const chat = await createChat(patient.id);
			await navigate({
				to: '/dashboard/chat/$chatId',
				params: { chatId: chat.id },
			});
		} catch (e) {
			toast.error(
				e instanceof ApiError
					? e.message
					: 'Could not start the conversation.',
			);
		} finally {
			setStartingId(null);
		}
	}

	return (
		<main className="mt-8 grid grid-cols-3 gap-5">
			<div className="col-span-2 flex w-full flex-col gap-7">
				<div className="w-full rounded-3xl bg-linear-to-bl from-[#0978AA] to-[#1497D2] px-8 py-10 text-white">
					<div className="space-y-3">
						<h2 className="text-2xl font-semibold">Access Premium Patients</h2>
						<p className="text-lg font-normal">
							Advanced clinical cases for specialized training.
						</p>
						<Button
							className="rounded-full bg-white/90 text-lg font-medium text-primary hover:bg-white"
							size="lg"
						>
							Go premium!
						</Button>
					</div>
				</div>

				<div id="patients">
					<PatientsCarousel
						patients={patients}
						loading={loadingPatients}
						startingId={startingId}
						onSelectPatient={startSession}
					/>
				</div>

				<div className="py-2">
					<ContinueSection chats={recentChats} patients={patients} />
				</div>
			</div>

			<div className="w-full">
				<div className="min-h-screen rounded-3xl border bg-white px-3.5 py-4">
					<h2 className="text-[16px] font-semibold text-black">Statistic</h2>
					<div className="flex flex-col justify-center gap-6 text-center">
						<div className="relative pt-4">
							<StatsAvatar
								user={user}
								streak={stats?.streak ?? 0}
								ringProgress={stats?.ringProgress ?? 0}
							/>
							<div className="mt-4 space-y-1">
								<h3 className="text-lg font-semibold">
									{greeting} {displayName}
								</h3>
								<p className="text-xs font-medium text-gray-500">
									{stats
										? `${stats.todayMinutes} min today`
										: 'Start a session to track your practice time.'}
								</p>
							</div>
						</div>
						{stats ? (
							<WeeklyMinutesChart data={stats.weeklyMinutes} />
						) : (
							<div className="h-[180px] rounded-xl bg-[#F0F5FA]" />
						)}
						<div className="space-y-3.5">
							<div className="flex items-center justify-between px-1">
								<h3 className="text-lg font-semibold">Friends</h3>
								<Button
									size="icon-lg"
									className="rounded-full border-primary text-primary hover:bg-primary/10"
									variant="outline"
									disabled
								>
									+
								</Button>
							</div>
							<div className="flex flex-col gap-5 rounded-xl bg-[#F0F5FA] px-3.5 py-4">
								<p className="text-sm text-muted-foreground">Coming soon</p>
								<Separator />
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
