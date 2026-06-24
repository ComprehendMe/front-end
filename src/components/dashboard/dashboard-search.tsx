import { useNavigate } from '@tanstack/react-router';
import {
	CircleDollarSign,
	History,
	MessageSquare,
	Search,
	Settings,
	User,
	Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
	ApiError,
	createChat,
	listChats,
	type Chat,
	type Patient,
} from '@/lib/api';

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

const BILLING_KEYWORDS = [
	'plan', 'premium', 'billing', 'upgrade', 'payment', 'subscription',
	'invoice', 'checkout', 'free', 'stripe', 'pagamento', 'assinatura',
];

function useNavItems(): SearchItem[] {
	const { t } = useTranslation();
	return [
		{
			id: 'patients',
			label: t('dashboard.search.talk_with_patients'),
			icon: <User className="h-5 w-5 text-[#1497D2]" />,
			to: '/dashboard',
		},
		{
			id: 'friends',
			label: t('dashboard.search.find_friends'),
			description: t('dashboard.search.coming_soon'),
			icon: <Users className="h-5 w-5 text-[#1497D2]" />,
			to: '/dashboard',
		},
		{
			id: 'history',
			label: t('dashboard.search.history'),
			icon: <History className="h-5 w-5 text-[#1497D2]" />,
			to: '/dashboard/history',
		},
		{
			id: 'conversations',
			label: t('dashboard.search.conversations'),
			icon: <MessageSquare className="h-5 w-5 text-[#1497D2]" />,
			to: '/dashboard',
		},
		{
			id: 'settings',
			label: t('dashboard.search.settings'),
			icon: <Settings className="h-5 w-5 text-[#1497D2]" />,
			to: '/dashboard/settings',
		},
	];
}

export function DashboardSearch({ patients = [] }: DashboardSearchProps) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const searchRef = useRef<HTMLDivElement>(null);
	const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');

	const close = useCallback(() => {
		setOpen(false);
		setQuery('');
	}, []);
	const [chats, setChats] = useState<Chat[]>([]);

	useEffect(() => {
		listChats()
			.then(setChats)
			.catch(() => setChats([]));
	}, []);

	const patientItems = useMemo<SearchItem[]>(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];

		return patients
			.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.problem.toLowerCase().includes(q) ||
					p.nationality.toLowerCase().includes(q) ||
					String(p.age).includes(q) ||
					p.difficulty.toLowerCase().includes(q) ||
					p.gender.toLowerCase().includes(q),
			)
			.slice(0, 5)
			.map((p) => ({
				id: `patient-${p.id}`,
				label: p.name,
				description: `${p.problem} · ${p.age} · ${p.nationality} · ${p.difficulty}`,
				icon: <User className="h-5 w-5 text-[#1497D2]" />,
				to: '/dashboard',
			}));
	}, [patients, query]);

	const chatItems = useMemo<SearchItem[]>(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];

		return chats
			.filter(
				(c) =>
					c.title.toLowerCase().includes(q) ||
					c.patient.name.toLowerCase().includes(q),
			)
			.slice(0, 5)
			.map((c) => ({
				id: `chat-${c.id}`,
				label: c.title,
				description: `${c.patient.name}`,
				icon: <MessageSquare className="h-5 w-5 text-[#1497D2]" />,
				to: '/dashboard/chat/$chatId',
				params: { chatId: c.id },
			}));
	}, [chats, query]);

	const navItems = useNavItems();

	const billingItem = useMemo<SearchItem | null>(() => {
		const q = query.trim().toLowerCase();
		if (!q) return null;
		if (BILLING_KEYWORDS.some((kw) => kw.includes(q) || q.includes(kw))) {
			return {
				id: 'billing',
				label: t('dashboard.search.billing_label'),
				description: t('dashboard.search.billing_desc'),
				icon: <CircleDollarSign className="h-5 w-5 text-[#1497D2]" />,
				to: '/dashboard/settings/billing',
			};
		}
		return null;
	}, [query, t]);

	const filteredNav = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return navItems;
		return navItems.filter((item) => item.label.toLowerCase().includes(q));
	}, [query, navItems]);

	const items = useMemo(() => {
		if (!query.trim()) return navItems;
		const result = [...patientItems, ...chatItems];
		if (billingItem) result.push(billingItem);
		result.push(...filteredNav);
		return result;
	}, [patientItems, chatItems, billingItem, filteredNav, query, navItems]);

	async function goToPatientChat(patientId: string) {
		close();
		try {
			const existing = chats.find((c: Chat) => c.patientId === patientId && !c.endedAt);
			if (existing) {
				await navigate({
					to: '/dashboard/chat/$chatId',
					params: { chatId: existing.id },
				});
				return;
			}
			const chat = await createChat(patientId);
			await navigate({
				to: '/dashboard/chat/$chatId',
				params: { chatId: chat.id },
			});
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.search.toast_error_open'),
			);
		}
	}

	function go(item: SearchItem) {
		if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
		close();
		if (item.id.startsWith('patient-')) {
			const patientId = item.id.replace('patient-', '');
			void goToPatientChat(patientId);
			return;
		}
		void navigate({ to: item.to, params: item.params });
	}

	return (
			<div ref={searchRef} className="relative w-full">
			<div className="relative w-full">
				<Input
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
					onFocus={() => {
						if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
						setOpen(true);
					}}
					onBlur={() => {
						blurTimeoutRef.current = setTimeout(() => close(), 200);
					}}
					onKeyDown={(e) => {
						if (e.key === 'Escape') {
							(e.target as HTMLInputElement).blur();
							close();
						}
					}}
					className="min-tap h-12 w-full rounded-full border-[#dbe4eb] bg-white px-7 py-4 pr-12 text-[15px]"
					placeholder={t('dashboard.search.placeholder')}
				/>
				<Search className="pointer-events-none absolute top-1/2 right-5 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
			</div>

			{open && (
				<div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-[#1C1F22]/10 bg-white p-2 shadow-lg max-h-[min(60dvh,400px)] overflow-y-auto">
					<ul className="flex flex-col">
						{items.length === 0 ? (
							<li className="px-3 py-4 text-center text-sm text-muted-foreground">
								{t('common.no_results')}
							</li>
						) : (
							items.map((item) => (
								<li key={item.id}>
									<button
										type="button"
										onPointerDown={() => go(item)}
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
										<span className="text-sm font-medium text-[#1497D2]">{t('common.go')}</span>
									</button>
								</li>
							))
						)}
					</ul>
				</div>
			)}
		</div>
	);
}
