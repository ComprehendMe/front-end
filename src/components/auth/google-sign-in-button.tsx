import { useTranslation } from 'react-i18next';
import { Google } from '@/components/ui/svgs/google';
import { Button } from '@/components/ui/button';
import { startGoogleOAuth } from '@/lib/api';
import { cn } from '@/lib/utils';

type GoogleSignInButtonProps = {
	disabled?: boolean;
	className?: string;
};

export function GoogleSignInButton({
	disabled = false,
	className,
}: GoogleSignInButtonProps) {
	const { t } = useTranslation();
	return (
		<Button
			type="button"
			variant="outline"
			size="lg"
			className={cn('rounded-full w-full', className)}
			disabled={disabled}
			onClick={() => startGoogleOAuth()}
		>
			<Google className="w-6 h-6" />
			<p className="font-normal text-[16px] text-[#1C1F22]">
				{t('auth.google_sign_in')}
			</p>
		</Button>
	);
}
