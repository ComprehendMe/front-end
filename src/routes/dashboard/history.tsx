import { createFileRoute } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
	createHistoryColumns,
	type HistoryRow,
} from '@/components/tables/history/columns';
import { DataTable } from '@/components/tables/history/data-table';
import { Button } from '@/components/ui/button';
import {
	ApiError,
	listChatHistory,
	listPatients,
	deleteChat,
} from '@/lib/api';
import { getPatientAvatar } from '@/lib/patient-avatar';
import {
	difficultyToLevel,
	getPatientIndex,
	getPatientProblemLabel,
} from '@/lib/patient-assets';

export const Route = createFileRoute('/dashboard/history')({
	component: HistoryPage,
});

function HistoryPage() {
	const { t } = useTranslation();
	const [rows, setRows] = useState<HistoryRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadHistory = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [history, patients] = await Promise.all([
				listChatHistory(),
				listPatients(),
			]);

			const mapped: HistoryRow[] = history.map((item) => {
				const idx = getPatientIndex(patients, item.patientId);
				const patient = patients[idx];
				return {
					id: item.id,
					chatId: item.chatId,
					name: item.name,
					problem: patient?.problem ?? getPatientProblemLabel(idx),
					difficult: difficultyToLevel(item.difficulty),
					ended: formatDistanceToNow(new Date(item.endedAt), {
						addSuffix: true,
						locale: enUS,
					}),
					duration: t('dashboard.history.duration_format', { duration: item.durationMinutes }),
					analysis: t('dashboard.history.review_link'),
					patientImageUrl: getPatientAvatar(item.name),
					pausedAt: item.pausedAt,
				};
			});

			setRows(mapped);
		} catch (e) {
			setRows([]);
			const msg = e instanceof ApiError ? e.message : t('dashboard.history.toast_load_error');
			setError(msg);
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}, [t]);

	useEffect(() => {
		void loadHistory();
	}, [loadHistory]);

	const columns = useMemo(
		() =>
			createHistoryColumns({
				t,
				onDelete: async (chatId) => {
					try {
						await deleteChat(chatId);
						toast.success(t('dashboard.history.toast_delete_success'));
						await loadHistory();
					} catch (e) {
						toast.error(
							e instanceof ApiError
								? e.message
								: t('dashboard.history.toast_delete_error'),
						);
					}
				},
			}),
		[loadHistory, t],
	);

	return (
		<main className="bg-[var(--dashboard-canvas-alt)] py-fluid-section">
			<div className="min-h-[70vh] space-y-fluid-lg overflow-hidden rounded-[20px] border border-[#1C1F22]/15 bg-white px-fluid-container py-fluid-section">
				<h2 className="text-fluid-2xl font-semibold text-[#1C1F22]">{t('dashboard.history.title')}</h2>
				{loading ? (
					<div className="space-y-4 animate-pulse">
						<div className="h-10 w-full rounded bg-muted" />
						<div className="h-10 w-full rounded bg-muted" />
						<div className="h-10 w-full rounded bg-muted" />
						<div className="h-10 w-3/4 rounded bg-muted" />
					</div>
				) : error ? (
					<div className="flex flex-col items-center gap-3 py-12">
						<p className="text-sm text-muted-foreground">{error}</p>
						<Button variant="outline" size="sm" onClick={() => void loadHistory()}>
							{t('dashboard.history.error_try_again')}
						</Button>
					</div>
				) : rows.length === 0 ? (
					<div className="flex flex-col items-center gap-2 py-12">
						<p className="text-sm font-medium text-muted-foreground">{t('dashboard.history.empty_title')}</p>
						<p className="text-xs text-muted-foreground">
							{t('dashboard.history.empty_desc')}
						</p>
					</div>
				) : (
					<DataTable columns={columns} data={rows} />
				)}
			</div>
		</main>
	);
}
