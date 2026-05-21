import { createFileRoute } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
	createHistoryColumns,
	type HistoryRow,
} from '@/components/tables/history/columns';
import { DataTable } from '@/components/tables/history/data-table';
import {
	ApiError,
	listChatHistory,
	listPatients,
	deleteChat,
} from '@/lib/api';
import {
	difficultyToLevel,
	getPatientImageUrl,
	getPatientIndex,
	getPatientProblemLabel,
} from '@/lib/patient-assets';

export const Route = createFileRoute('/dashboard/history')({
	component: HistoryPage,
});

function HistoryPage() {
	const [rows, setRows] = useState<HistoryRow[]>([]);
	const [loading, setLoading] = useState(true);

	const loadHistory = useCallback(async () => {
		setLoading(true);
		try {
			const [history, patients] = await Promise.all([
				listChatHistory(),
				listPatients(),
			]);

			const mapped: HistoryRow[] = history.map((item) => {
				const idx = getPatientIndex(patients, item.patientId);
				return {
					id: item.id,
					chatId: item.chatId,
					name: item.name,
					problem: getPatientProblemLabel(idx),
					difficult: difficultyToLevel(item.difficulty),
					ended: formatDistanceToNow(new Date(item.endedAt), {
						addSuffix: true,
						locale: enUS,
					}),
					duration: `${item.durationMinutes} minutos`,
					analysis: 'Review',
					patientImageUrl: getPatientImageUrl(idx),
				};
			});

			setRows(mapped);
		} catch (e) {
			toast.error(
				e instanceof ApiError
					? e.message
					: 'Não foi possível carregar o histórico.',
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadHistory();
	}, [loadHistory]);

	const columns = useMemo(
		() =>
			createHistoryColumns({
				onDelete: async (chatId) => {
					try {
						await deleteChat(chatId);
						toast.success('Conversa eliminada.');
						await loadHistory();
					} catch (e) {
						toast.error(
							e instanceof ApiError
								? e.message
								: 'Não foi possível eliminar.',
						);
					}
				},
			}),
		[loadHistory],
	);

	return (
		<main className="py-7">
			<div className="h-screen space-y-[34px] overflow-hidden rounded-[20px] border border-[#1C1F22]/15 bg-white px-12 py-[38px]">
				<h2 className="text-2xl font-semibold text-[#1C1F22]">History</h2>
				{loading ? (
					<p className="text-sm text-muted-foreground">A carregar…</p>
				) : (
					<DataTable columns={columns} data={rows} />
				)}
			</div>
		</main>
	);
}
