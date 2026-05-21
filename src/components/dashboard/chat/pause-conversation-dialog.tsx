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
					<DialogTitle>Pausar conversa?</DialogTitle>
					<DialogDescription>
						Tens uma conversa ativa. Queres pausar para sair? Se cancelares,
						ficas nesta conversa.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={onCancel} disabled={loading}>
						Não, continuar
					</Button>
					<Button onClick={onConfirm} disabled={loading}>
						{loading ? 'A pausar…' : 'Sim, pausar'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
