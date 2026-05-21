import { useBlocker } from '@tanstack/react-router';
import { type MutableRefObject, useState } from 'react';
import { pauseChat } from '@/lib/api';

type UseConversationGuardOptions = {
	chatId: string;
	isActive: boolean;
	skipBlockRef?: MutableRefObject<boolean>;
};

export function useConversationGuard({
	chatId,
	isActive,
	skipBlockRef,
}: UseConversationGuardOptions) {
	const [pausing, setPausing] = useState(false);

	const blocker = useBlocker({
		shouldBlockFn: ({ next }) => {
			if (skipBlockRef?.current) return false;
			if (!isActive) return false;
			if (next.fullPath.includes(`/dashboard/chat/${chatId}`)) return false;
			return true;
		},
		enableBeforeUnload: () => isActive,
		withResolver: true,
	});

	async function confirmPause() {
		setPausing(true);
		try {
			await pauseChat(chatId);
			blocker.proceed?.();
		} catch {
			blocker.reset?.();
		} finally {
			setPausing(false);
		}
	}

	function cancelLeave() {
		blocker.reset?.();
	}

	return {
		dialogOpen: blocker.status === 'blocked',
		pausing,
		confirmPause,
		cancelLeave,
	};
}
