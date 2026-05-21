import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatMessageTime } from '@/lib/format-message-time';
import type { Message } from '@/lib/api';
import { cn } from '@/lib/utils';

type ChatMessageRowProps = {
	message: Message;
	patientName: string;
	patientAvatarUrl: string;
	userLabel: string;
	userAvatarUrl?: string | null;
	userInitials: string;
	timeFormat?: '12h' | '24h';
};

export function ChatMessageRow({
	message,
	patientName,
	patientAvatarUrl,
	userLabel,
	userAvatarUrl,
	userInitials,
	timeFormat = '12h',
}: ChatMessageRowProps) {
	const isUser = message.role === 'user';
	const timestamp = message.createdAt
		? formatMessageTime(message.createdAt, timeFormat)
		: '';

	if (isUser) {
		return (
			<div className="flex flex-col items-end gap-2">
				<div className="flex items-center gap-2">
					<div className="text-right">
						<p className="font-semibold text-sm text-foreground">{userLabel}</p>
						{timestamp ? (
							<p className="text-xs text-muted-foreground">{timestamp}</p>
						) : null}
					</div>
					<Avatar className="h-10 w-10 shrink-0 border border-[#E8EEF4]">
						{userAvatarUrl ? (
							<AvatarImage src={userAvatarUrl} alt={userLabel} />
						) : null}
						<AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
							{userInitials}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="max-w-[min(85%,42rem)] rounded-2xl bg-[#D6EBF7] px-4 py-3 text-[15px] leading-relaxed text-foreground">
					<p className="whitespace-pre-wrap">{message.content}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex gap-3">
			<Avatar className="h-10 w-10 shrink-0 border border-[#E8EEF4]">
				<AvatarImage src={patientAvatarUrl} alt={patientName} />
				<AvatarFallback className="bg-[#F0F5FA] text-xs font-semibold text-primary">
					{patientName.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div>
					<p className="font-semibold text-sm text-foreground">{patientName}</p>
					{timestamp ? (
						<p className="text-xs text-muted-foreground">{timestamp}</p>
					) : null}
				</div>
				<div
					className={cn(
						'max-w-[min(85%,42rem)] rounded-2xl bg-[#F0F5FA] px-4 py-3 text-[15px] leading-relaxed text-foreground',
					)}
				>
					<p className="whitespace-pre-wrap">{message.content}</p>
				</div>
			</div>
		</div>
	);
}
