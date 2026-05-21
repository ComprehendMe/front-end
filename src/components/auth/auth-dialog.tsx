import { useState, type ReactNode } from 'react';
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
import SignUpForm from './forms/register';

type AuthMode = 'login' | 'register' | 'pending';

type AuthDialogProps = {
	trigger?: ReactNode;
};

export default function AuthDialog({ trigger }: AuthDialogProps) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<AuthMode>('login');
	const [pendingEmail, setPendingEmail] = useState('');
	const toggleMode = () => setMode(mode === 'login' ? 'register' : 'login');

	const handleEmailSent = (email: string) => {
		setPendingEmail(email);
		setMode('pending');
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} modal>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button className="rounded-full px-6 text-white">To start</Button>
				)}
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className={cn('gap-6 sm:max-w-[444px]')}
			>
				{mode === 'pending' ? (
					<>
						<DialogHeader className="items-center text-center">
							<DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
								Check your email
							</DialogTitle>
							<DialogDescription className="text-base text-[#4B4E58]">
								We sent a link to{' '}
								<span className="font-medium text-foreground">
									{pendingEmail}
								</span>
								. Open the email and click the link to continue.
							</DialogDescription>
						</DialogHeader>
						<p className="text-center text-sm text-muted-foreground">
							The link opens this app and redirects you to the dashboard.
						</p>
						<Button
							variant="outline"
							className="w-full rounded-full"
							onClick={() => setMode('login')}
						>
							Back to login
						</Button>
					</>
				) : (
					<>
						<DialogHeader className="items-center">
							<DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
								Welcome to ComprehendMe
							</DialogTitle>
						</DialogHeader>
						{mode === 'login' && (
							<LoginForm
								toggleMode={toggleMode}
								onEmailSent={handleEmailSent}
							/>
						)}
						{mode === 'register' && (
							<SignUpForm
								toggleMode={toggleMode}
								onEmailSent={handleEmailSent}
							/>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
