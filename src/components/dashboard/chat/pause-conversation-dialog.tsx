import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

type PauseConversationDialogProps = {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
};

export function PauseConversationDialog({
	open,
	onConfirm,
	onCancel,
	loading,
}: PauseConversationDialogProps) {
	return (
		<Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Pause conversation?</DialogTitle>
					<DialogDescription>
						You have an active conversation. Do you want to pause it before
						leaving? If you cancel, you will stay in this chat.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={onCancel} disabled={loading}>
						No, stay here
					</Button>
					<Button onClick={onConfirm} disabled={loading}>
						{loading ? 'Pausing…' : 'Yes, pause'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
