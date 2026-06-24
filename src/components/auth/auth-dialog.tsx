import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import LoginForm from './forms/login';
import SignupWizard from './forms/signup-wizard';

type AuthMode = 'login' | 'register' | 'pending';

type AuthDialogProps = {
	trigger?: ReactNode;
};

export default function AuthDialog({ trigger }: AuthDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<AuthMode>('login');
	const [pendingEmail, setPendingEmail] = useState('');
	const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
	const toggleMode = () => {
		setMode(mode === 'login' ? 'register' : 'login');
		setRegisterStep(1);
	};

	const handleEmailSent = (email: string) => {
		setPendingEmail(email);
		setMode('pending');
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} modal>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button className="rounded-full px-6 text-white">{t('landing.cta_button')}</Button>
				)}
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className={cn('gap-6 max-w-[min(95vw,444px)] sm:max-w-[444px]')}
			>
				{mode === 'pending' ? (
					<>
						<DialogHeader className="items-center text-center">
							<DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
								{t('auth.pending_title')}
							</DialogTitle>
							<DialogDescription className="text-base text-[#4B4E58]">
								{t('auth.pending_description_prefix')}
								<span className="font-medium text-foreground break-all">
									{pendingEmail}
								</span>
								{t('auth.pending_description_suffix')}
							</DialogDescription>
						</DialogHeader>
						<p className="text-center text-sm text-muted-foreground">
							{t('auth.pending_hint')}
						</p>
						<Button
							variant="outline"
							className="w-full rounded-full"
							onClick={() => setMode('login')}
						>
							{t('auth.pending_back_to_login')}
						</Button>
					</>
				) : (
					<>
						{(mode === 'login' ||
							(mode === 'register' && registerStep === 1)) && (
							<DialogHeader className="items-center">
								<DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
									{t('auth.login_dialog_title')}
								</DialogTitle>
							</DialogHeader>
						)}
						{mode === 'login' && (
							<LoginForm
								toggleMode={toggleMode}
								onEmailSent={handleEmailSent}
							/>
						)}
						{mode === 'register' && (
							<SignupWizard
								onBackToLogin={toggleMode}
								onEmailSent={handleEmailSent}
								onStepChange={setRegisterStep}
							/>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
