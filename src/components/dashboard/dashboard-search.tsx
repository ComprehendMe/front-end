import { useNavigate } from '@tanstack/react-router';
import {
	IconHistory,
	IconMessage,
	IconSettings,
	IconUser,
	IconUsers,
} from '@tabler/icons-react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { Patient } from '@/lib/api';

type SearchItem = {
	id: string;
	label: string;
	description?: string;
	icon: React.ReactNode;
	to: string;
	params?: Record<string, string>;
};

type DashboardSearchProps = {
	patients?: Patient[];
};

const NAV_ITEMS: SearchItem[] = [
	{
		id: 'patients',
		label: 'Talk with patients',
		icon: <IconUser className="h-5 w-5 text-[#1497D2]" />,
		to: '/dashboard',
	},
	{
		id: 'friends',
		label: 'Find friends',
		description: 'Coming soon',
		icon: <IconUsers className="h-5 w-5 text-[#1497D2]" />,
		to: '/dashboard',
	},
	{
		id: 'history',
		label: 'History',
		icon: <IconHistory className="h-5 w-5 text-[#1497D2]" />,
		to: '/dashboard/history',
	},
	{
		id: 'conversations',
		label: 'Conversations',
		icon: <IconMessage className="h-5 w-5 text-[#1497D2]" />,
		to: '/dashboard',
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: <IconSettings className="h-5 w-5 text-[#1497D2]" />,
		to: '/dashboard/settings',
	},
];

export function DashboardSearch({ patients = [] }: DashboardSearchProps) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');

	const patientItems = useMemo<SearchItem[]>(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];

		return patients
			.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.problem.toLowerCase().includes(q),
			)
			.slice(0, 5)
			.map((p) => ({
				id: `patient-${p.id}`,
				label: p.name,
				description: p.problem.slice(0, 60),
				icon: <IconUser className="h-5 w-5 text-[#1497D2]" />,
				to: '/dashboard',
			}));
	}, [patients, query]);

	const filteredNav = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return NAV_ITEMS;
		return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
	}, [query]);

	const items = query.trim() ? [...patientItems, ...filteredNav] : NAV_ITEMS;

	function go(item: SearchItem) {
		setOpen(false);
		setQuery('');
		if (item.id.startsWith('patient-')) {
			const patientId = item.id.replace('patient-', '');
			const patient = patients.find((p) => p.id === patientId);
			if (patient) {
				void navigate({ to: '/dashboard', hash: 'patients' });
			}
			return;
		}
		void navigate({ to: item.to, params: item.params });
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div className="relative w-full">
					<Input
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setOpen(true);
						}}
						onFocus={() => setOpen(true)}
						className="h-12 w-full rounded-full border-[#1C1F22]/15 bg-white px-8 py-4 pr-12"
						placeholder="What's up?"
					/>
					<Search className="pointer-events-none absolute top-1/2 right-5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				</div>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[var(--radix-popover-trigger-width)] rounded-2xl border-[#1C1F22]/10 p-2 shadow-lg"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<ul className="flex flex-col">
					{items.length === 0 ? (
						<li className="px-3 py-4 text-center text-sm text-muted-foreground">
							No results
						</li>
					) : (
						items.map((item) => (
							<li key={item.id}>
								<button
									type="button"
									onClick={() => go(item)}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[#F0F5FA]"
								>
									{item.icon}
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-[#1C1F22]">
											{item.label}
										</p>
										{item.description ? (
											<p className="truncate text-xs text-muted-foreground">
												{item.description}
											</p>
										) : null}
									</div>
									<span className="text-sm font-medium text-[#1497D2]">Go</span>
								</button>
							</li>
						))
					)}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
