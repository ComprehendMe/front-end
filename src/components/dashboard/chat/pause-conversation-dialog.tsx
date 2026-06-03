import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();
	return (
		<Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{t('components.pause-dialog.title')}</DialogTitle>
					<DialogDescription>
						{t('components.pause-dialog.description')}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={onCancel} disabled={loading}>
						{t('components.pause-dialog.cancel_btn')}
					</Button>
					<Button onClick={onConfirm} disabled={loading}>
						{loading ? t('components.pause-dialog.pausing_btn') : t('components.pause-dialog.confirm_btn')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
