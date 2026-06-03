import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type SignupProgressProps = {
	step: 2 | 3;
};

export function SignupProgress({ step }: SignupProgressProps) {
	const { t } = useTranslation();
	const progress = step === 2 ? 66.666 : 100;

	return (
		<div className="flex w-full flex-col gap-3 text-center">
			<h2 className="text-[24px] font-medium leading-tight text-[#1C1F22]">
				{t('auth.signup_progress_title')}
			</h2>
			<p className="text-[16px] font-normal text-[#4B4E58]">
				{t('auth.signup_progress_label', { step })}
			</p>
			<div className="h-2 w-full overflow-hidden rounded-full bg-[#E8EEF4]">
				<div
					className="h-full rounded-full bg-[#0077A6] transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

export function signupFieldClassName(className?: string) {
	return cn(
		'flex h-[45px] w-full appearance-none items-center rounded-lg border-0 bg-[#F0F5FA] px-5 text-[16px] font-normal text-[#1C1F22] outline-none focus-visible:ring-2 focus-visible:ring-[#0077A6]/30',
		className,
	);
}

export function SignupFooter({
	onBack,
	primaryLabel,
	primaryDisabled,
	onPrimary,
	primaryType = 'button',
}: {
	onBack: () => void;
	primaryLabel: string;
	primaryDisabled?: boolean;
	onPrimary?: () => void;
	primaryType?: 'button' | 'submit';
}) {
	const { t } = useTranslation();
	return (
		<div className="flex w-full items-center justify-between pt-2">
			<button
				type="button"
				onClick={onBack}
				className="inline-flex items-center gap-1 text-[16px] font-normal text-[#1C1F22] hover:opacity-80"
			>
				<span aria-hidden>&lt;</span>
				<span>{t('components.signup-wizard.go_back')}</span>
			</button>
			<button
				type={primaryType}
				disabled={primaryDisabled}
				onClick={onPrimary}
				className="inline-flex h-[45px] min-w-[140px] items-center justify-center rounded-full bg-[#0077A6] px-8 text-[16px] font-normal text-white transition hover:bg-[#006690] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{primaryLabel}
			</button>
		</div>
	);
}
