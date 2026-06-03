import { Check, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
	ApiError,
	listFriends,
	removeFriend,
	requestFriend,
	respondToFriendRequest,
	searchFriends,
	type FriendSearchResult,
	type FriendUser,
} from '@/lib/api';
import { getInitials } from '@/lib/user-display';

const PREVIEW_LIMIT = 3;

function FriendRow({
	user,
	onRemove,
}: {
	user: FriendUser;
	onRemove: (id: string) => void;
}) {
	const { t } = useTranslation();
	const displayName = user.name?.trim() || t('components.friends-panel.display_name_fallback');

	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex min-w-0 items-center gap-2.5">
				<Avatar className="h-9 w-9 shrink-0">
					{user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
					<AvatarFallback className="bg-primary/10 text-xs text-primary">
						{getInitials({ name: user.name, email: user.email ?? '' })}
					</AvatarFallback>
				</Avatar>
				<span className="truncate text-sm font-medium text-[#1C1F22]">
					{displayName}
				</span>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon-sm"
						className="shrink-0 text-muted-foreground"
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-[120px]">
					<DropdownMenuItem
						variant="destructive"
						onClick={() => onRemove(user.id)}
					>
						<Trash2 className="h-4 w-4" />
						{t('components.friends-panel.remove_action')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function SearchResultRow({
	result,
	onAdd,
	onRespond,
	busy,
}: {
	result: FriendSearchResult;
	onAdd: (id: string) => void;
	onRespond: (requestId: string, status: 'ACCEPTED' | 'DECLINED') => void;
	busy: boolean;
}) {
	const { t } = useTranslation();
	const displayName = result.name?.trim() || t('components.friends-panel.display_name_fallback');

	return (
		<div className="flex items-center justify-between gap-2 py-1">
			<div className="flex min-w-0 items-center gap-2.5">
				<Avatar className="h-9 w-9 shrink-0">
					{result.avatar ? <AvatarImage src={result.avatar} alt="" /> : null}
					<AvatarFallback className="bg-primary/10 text-xs text-primary">
						{getInitials({ name: result.name, email: '' })}
					</AvatarFallback>
				</Avatar>
				<span className="truncate text-sm font-medium">{displayName}</span>
			</div>
			{result.relation === 'accepted' || result.relation === 'pending' ? (
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
					<Check className="h-4 w-4" />
				</span>
			) : result.relation === 'incoming' && result.requestId ? (
				<div className="flex shrink-0 gap-1">
					<Button
						size="sm"
						className="h-8 rounded-full px-2 text-xs"
						disabled={busy}
						onClick={() =>
							result.requestId && onRespond(result.requestId, 'ACCEPTED')
						}
					>
						{t('components.friends-panel.accept')}
					</Button>
					<Button
						size="sm"
						variant="outline"
						className="h-8 rounded-full px-2 text-xs"
						disabled={busy}
						onClick={() =>
							result.requestId && onRespond(result.requestId, 'DECLINED')
						}
					>
						{t('components.friends-panel.decline')}
					</Button>
				</div>
			) : (
				<Button
					size="sm"
					className="h-8 shrink-0 rounded-full px-3 text-xs font-medium"
					disabled={busy}
					onClick={() => onAdd(result.id)}
				>
					{t('components.friends-panel.add_friend')}
				</Button>
			)}
		</div>
	);
}

export function FriendsPanel() {
	const { t } = useTranslation();
	const [friends, setFriends] = useState<FriendUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<FriendSearchResult[]>([]);
	const [searching, setSearching] = useState(false);
	const [addingId, setAddingId] = useState<string | null>(null);
	const [respondingId, setRespondingId] = useState<string | null>(null);
	const [showAll, setShowAll] = useState(false);

	const loadFriends = useCallback(async () => {
		try {
			const data = await listFriends();
			setFriends(data);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('components.friends-panel.toast_load_error'),
			);
		} finally {
			setLoading(false);
		}
	}, [t]);

	useEffect(() => {
		void loadFriends();
	}, [loadFriends]);

	useEffect(() => {
		if (!searchOpen) return;

		const q = searchQuery.trim();
		if (q.length < 2) {
			setSearchResults([]);
			return;
		}

		const timer = setTimeout(() => {
			setSearching(true);
			searchFriends(q)
				.then(setSearchResults)
				.catch((e) => {
					toast.error(
						e instanceof ApiError ? e.message : t('components.friends-panel.toast_search_error'),
					);
				})
				.finally(() => setSearching(false));
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery, searchOpen, t]);

	async function handleAddFriend(userId: string) {
		setAddingId(userId);
		try {
			await requestFriend(userId);
			toast.success(t('components.friends-panel.toast_friend_request_sent'));
			setSearchResults((prev) =>
				prev.map((u) =>
					u.id === userId ? { ...u, relation: 'pending' as const } : u,
				),
			);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('components.friends-panel.toast_request_error'),
			);
		} finally {
			setAddingId(null);
		}
	}

	async function handleRespond(
		requestId: string,
		status: 'ACCEPTED' | 'DECLINED',
	) {
		setRespondingId(requestId);
		try {
			await respondToFriendRequest(requestId, status);
			toast.success(
				status === 'ACCEPTED' ? t('components.friends-panel.toast_accepted') : t('components.friends-panel.toast_declined'),
			);
			await loadFriends();
			setSearchResults((prev) =>
				prev.filter((u) => u.requestId !== requestId),
			);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('components.friends-panel.toast_update_error'),
			);
		} finally {
			setRespondingId(null);
		}
	}

	async function handleRemove(friendId: string) {
		try {
			await removeFriend(friendId);
			setFriends((prev) => prev.filter((f) => f.id !== friendId));
			toast.success(t('components.friends-panel.toast_friend_removed'));
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('components.friends-panel.toast_remove_error'),
			);
		}
	}

	const visibleFriends = showAll ? friends : friends.slice(0, PREVIEW_LIMIT);

	return (
		<div className="space-y-3.5">
			<Popover open={searchOpen} onOpenChange={setSearchOpen}>
				<div className="flex items-center justify-between px-1">
					<h3 className="text-lg font-semibold">{t('components.friends-panel.title')}</h3>
					<PopoverAnchor asChild>
						<PopoverTrigger asChild>
							<Button
								size="icon-lg"
								className="rounded-full border-primary text-primary hover:bg-primary/10"
								variant="outline"
								aria-label={t('components.friends-panel.add_aria')}
							>
								<Plus className="h-5 w-5" />
							</Button>
						</PopoverTrigger>
					</PopoverAnchor>
				</div>

				<PopoverContent
					align="end"
					side="bottom"
					className="w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-[#E8EDF2] p-0 shadow-lg"
				>
					<div className="p-3">
						<div className="relative">
							<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder={t('components.friends-panel.search_placeholder')}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="rounded-xl border-0 bg-[#F0F5FA] pl-9"
								autoFocus
							/>
						</div>
					</div>
					<Separator />
					<div className="max-h-[220px] space-y-1 overflow-y-auto px-3 py-2 max-md:max-h-[40dvh]">
						{searchQuery.trim().length < 2 ? (
							<p className="py-4 text-center text-sm text-muted-foreground">
								{t('components.friends-panel.search_hint')}
							</p>
						) : searching ? (
							<p className="py-4 text-center text-sm text-muted-foreground">
								{t('components.friends-panel.search_loading')}
							</p>
						) : searchResults.length === 0 ? (
							<p className="py-4 text-center text-sm text-muted-foreground">
								{t('components.friends-panel.no_users')}
							</p>
						) : (
							searchResults.map((result) => (
								<SearchResultRow
									key={result.id}
									result={result}
									busy={
										addingId === result.id ||
										respondingId === result.requestId
									}
									onAdd={(id) => void handleAddFriend(id)}
									onRespond={(requestId, status) =>
										void handleRespond(requestId, status)
									}
								/>
							))
						)}
					</div>
				</PopoverContent>
			</Popover>

			<div className="flex flex-col gap-4 rounded-[16px] bg-[#F0F5FA] px-3.5 py-4">
				{loading ? (
					<p className="text-sm text-muted-foreground">{t('components.friends-panel.loading')}</p>
				) : friends.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						{t('components.friends-panel.empty')}
					</p>
				) : (
					visibleFriends.map((friend) => (
						<FriendRow
							key={friend.id}
							user={friend}
							onRemove={(id) => void handleRemove(id)}
						/>
					))
				)}
				{friends.length > PREVIEW_LIMIT ? (
					<>
						<Separator />
						<Button
							variant="ghost"
							className="h-10 w-full rounded-xl bg-[#D6EBFA] text-sm font-semibold text-primary hover:bg-[#c5e2f7] hover:text-primary"
							onClick={() => setShowAll((v) => !v)}
						>
							{showAll ? t('components.friends-panel.show_less') : t('components.friends-panel.show_all')}
						</Button>
					</>
				) : null}
			</div>
		</div>
	);
}
