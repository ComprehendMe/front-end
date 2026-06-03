import { MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const MAX_CHARS = 1500;
const MAX_MESSAGES_PER_DAY = 25;

type ChatComposerProps = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	disabled?: boolean;
	messagesSentToday?: number;
	className?: string;
};

export function ChatComposer({
	value,
	onChange,
	onSubmit,
	disabled,
	messagesSentToday = 0,
	className,
}: ChatComposerProps) {
	const { t } = useTranslation();
	const charCount = value.length;

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!disabled && value.trim()) onSubmit();
		}
	}

	return (
		<div className={cn('flex w-full flex-col items-center gap-3', className)}>
			<div className="relative w-full max-w-3xl rounded-xl border border-[#1497D2]/50 bg-white">
				<div className="flex items-start gap-2 px-4 pt-3.5 pb-2">
					<textarea
						value={value}
						onChange={(e) => {
							if (e.target.value.length <= MAX_CHARS) onChange(e.target.value);
						}}
						onKeyDown={handleKeyDown}
						placeholder={t('components.chat-composer.placeholder')}
						disabled={disabled}
						rows={2}
						className="min-h-[44px] flex-1 resize-none border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
					/>
					<button
						type="button"
						aria-label={t('components.chat-composer.send_aria')}
						disabled={disabled || !value.trim()}
						onClick={onSubmit}
						className="mt-0.5 shrink-0 rounded-md p-1.5 text-[#1497D2] transition-colors hover:bg-[#1497D2]/10 disabled:opacity-40"
					>
						<Send className="h-4 w-4 stroke-[1.75]" />
					</button>
				</div>
				<div className="flex items-center justify-between border-t border-[#E8EEF4] px-4 py-2 text-[11px] text-muted-foreground">
					<span className="flex items-center gap-1">
						<MessageCircle className="h-3 w-3" />
						{t('components.chat-composer.message_count', { sent: messagesSentToday, max: MAX_MESSAGES_PER_DAY })}
					</span>
					<span>
						{charCount.toLocaleString('en-US')}/{MAX_CHARS.toLocaleString('en-US')}
					</span>
				</div>
			</div>
			<p className="max-w-3xl text-center text-[11px] text-muted-foreground">
				{t('components.chat-composer.upgrade_text')}{' '}
				<button type="button" className="font-medium text-foreground underline">
					{t('components.chat-composer.upgrade_link')}
				</button>
			</p>
		</div>
	);
}
