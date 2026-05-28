import { Bell, Check, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
	ApiError,
	listFriendRequests,
	respondToFriendRequest,
	type FriendRequest,
} from '@/lib/api';
import { getInitials } from '@/lib/user-display';
import { showDesktopNotification } from '@/lib/user-preferences';

export function NotificationBell() {
	const [open, setOpen] = useState(false);
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const seenIdsRef = useRef<Set<string>>(new Set());
	const [respondingId, setRespondingId] = useState<string | null>(null);

	const loadRequests = useCallback(async () => {
		try {
			const data = await listFriendRequests();
			setRequests(data);

			for (const req of data) {
				if (seenIdsRef.current.has(req.id)) continue;
				const name = req.requester.name?.trim() || 'Someone';
				showDesktopNotification(
					'Friend request',
					`${name} sent you a friend request.`,
				);
				seenIdsRef.current.add(req.id);
			}
		} catch {
			// silent — user may be offline
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadRequests();
		const interval = setInterval(() => void loadRequests(), 30_000);
		return () => clearInterval(interval);
	}, [loadRequests]);

	async function handleRespond(
		requestId: string,
		status: 'ACCEPTED' | 'DECLINED',
	) {
		setRespondingId(requestId);
		try {
			await respondToFriendRequest(requestId, status);
			setRequests((prev) => prev.filter((r) => r.id !== requestId));
			toast.success(
				status === 'ACCEPTED'
					? 'Friend request accepted.'
					: 'Friend request declined.',
			);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : 'Could not update request.',
			);
		} finally {
			setRespondingId(null);
		}
	}

	const count = requests.length;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					size="icon-lg"
					className="relative rounded-full border-[#dbe4eb] text-gray-500"
					variant="outline"
					aria-label="Notifications"
				>
					<Bell size={22} />
					{count > 0 ? (
						<span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
							{count > 9 ? '9+' : count}
						</span>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-[min(360px,calc(100vw-2rem))] p-0">
				<div className="px-4 py-3">
					<p className="font-semibold text-[#1C1F22]">Notifications</p>
				</div>
				<Separator />
				<div className="max-h-[320px] overflow-y-auto p-2 max-md:max-h-[50dvh]">
					{loading ? (
						<p className="px-2 py-6 text-center text-sm text-muted-foreground">
							Loading…
						</p>
					) : requests.length === 0 ? (
						<p className="px-2 py-6 text-center text-sm text-muted-foreground">
							No new notifications
						</p>
					) : (
						requests.map((req) => {
							const name = req.requester.name?.trim() || 'Someone';
							return (
								<div
									key={req.id}
									className="rounded-xl p-3 hover:bg-[#F0F5FA]"
								>
									<div className="flex gap-3">
										<Avatar className="h-10 w-10 shrink-0">
											{req.requester.avatar ? (
												<AvatarImage src={req.requester.avatar} alt="" />
											) : null}
											<AvatarFallback className="bg-primary/10 text-xs text-primary">
												{getInitials({
													name: req.requester.name,
													email: req.requester.email ?? '',
												})}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0 flex-1">
											<p className="text-sm text-[#1C1F22]">
												<span className="font-semibold">{name}</span> sent you a
												friend request.
											</p>
											<p className="mt-0.5 text-xs text-muted-foreground">
												Do you want to accept?
											</p>
											<div className="mt-2 flex gap-2">
												<Button
													size="sm"
													className="h-8 rounded-full px-3 text-xs"
													disabled={respondingId === req.id}
													onClick={() =>
														void handleRespond(req.id, 'ACCEPTED')
													}
												>
													<Check className="mr-1 h-3.5 w-3.5" />
													Accept
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="h-8 rounded-full px-3 text-xs"
													disabled={respondingId === req.id}
													onClick={() =>
														void handleRespond(req.id, 'DECLINED')
													}
												>
													<X className="mr-1 h-3.5 w-3.5" />
													Decline
												</Button>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
