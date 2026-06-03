import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	ApiError,
	listFriends,
	removeFriend,
	updateFriendNickname,
	type FriendInfo,
} from "@/lib/api";
import { getInitials } from "@/lib/user-display";

export const Route = createFileRoute("/dashboard/settings/friends")({
	component: FriendsSettingsPage,
});

function FriendsSettingsPage() {
	const { t } = useTranslation();
	const [friends, setFriends] = useState<FriendInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [nicknameDraft, setNicknameDraft] = useState("");
	const [removingId, setRemovingId] = useState<string | null>(null);

	const loadFriends = useCallback(async () => {
		try {
			const data = await listFriends();
			setFriends(data);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.friends.toast_load_error'),
			);
		} finally {
			setLoading(false);
		}
	}, [t]);

	useEffect(() => {
		void loadFriends();
	}, [loadFriends]);

	function startEdit(friend: FriendInfo) {
		setEditingId(friend.id);
		setNicknameDraft(friend.nickname ?? "");
	}

	function cancelEdit() {
		setEditingId(null);
		setNicknameDraft("");
	}

	async function saveNickname(friend: FriendInfo) {
		const trimmed = nicknameDraft.trim() || null;
		try {
			await updateFriendNickname(friend.friendshipId, trimmed);
			setFriends((prev) =>
				prev.map((f) =>
					f.id === friend.id ? { ...f, nickname: trimmed } : f,
				),
			);
			toast.success(t('dashboard.settings.friends.toast_nickname_saved'));
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.friends.toast_nickname_error'),
			);
		} finally {
			setEditingId(null);
			setNicknameDraft("");
		}
	}

	async function handleRemove(friendId: string) {
		setRemovingId(friendId);
		try {
			await removeFriend(friendId);
			setFriends((prev) => prev.filter((f) => f.id !== friendId));
			toast.success(t('dashboard.settings.friends.toast_friend_removed'));
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.friends.toast_remove_error'),
			);
		} finally {
			setRemovingId(null);
		}
	}

	const displayName = (f: FriendInfo) => f.nickname?.trim() || f.name?.trim() || t('dashboard.settings.friends.display_name_fallback');

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">{t('dashboard.settings.friends.title')}</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-4">
					{loading ? (
						<p className="text-sm text-muted-foreground">{t('dashboard.settings.friends.loading')}</p>
					) : friends.length === 0 ? (
						<p className="text-sm text-muted-foreground">{t('dashboard.settings.friends.empty')}</p>
					) : (
						friends.map((friend) => (
							<div
								key={friend.id}
								className="flex items-center justify-between gap-3 rounded-xl border border-[#E8EDF2] bg-[#FCFDFE] px-4 py-3"
							>
								<div className="flex min-w-0 items-center gap-3">
									<Avatar className="h-10 w-10 shrink-0">
										{friend.avatar ? <AvatarImage src={friend.avatar} alt="" /> : null}
										<AvatarFallback className="bg-primary/10 text-xs text-primary">
											{getInitials({ name: friend.name, email: "" })}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										{editingId === friend.id ? (
											<div className="flex items-center gap-2">
												<Input
													value={nicknameDraft}
													onChange={(e) => setNicknameDraft(e.target.value)}
													placeholder={t('dashboard.settings.friends.nickname_placeholder')}
													className="h-8 w-[180px] text-sm"
													autoFocus
													onKeyDown={(e) => {
														if (e.key === "Enter") void saveNickname(friend);
														if (e.key === "Escape") cancelEdit();
													}}
												/>
												<Button
													size="icon-sm"
													variant="ghost"
													className="h-7 w-7 text-emerald-600"
													aria-label={t('dashboard.settings.friends.nickname_save_aria')}
													onClick={() => void saveNickname(friend)}
												>
													<Check className="h-4 w-4" />
												</Button>
												<Button
													size="icon-sm"
													variant="ghost"
													className="h-7 w-7 text-muted-foreground"
													aria-label={t('dashboard.settings.friends.nickname_cancel_aria')}
													onClick={cancelEdit}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										) : (
											<>
												<p className="truncate text-sm font-medium text-[#1C1F22]">
													{displayName(friend)}
												</p>
												{friend.nickname ? (
													<p className="truncate text-xs text-muted-foreground">
														{friend.name}
													</p>
												) : null}
											</>
										)}
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-1">
									<Button
										size="icon-sm"
										variant="ghost"
										className="h-8 w-8 text-muted-foreground"
										onClick={() => startEdit(friend)}
										disabled={editingId !== null}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										size="icon-sm"
										variant="ghost"
										className="h-8 w-8 text-red-500 hover:text-red-600"
										disabled={removingId === friend.id}
										onClick={() => void handleRemove(friend.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
