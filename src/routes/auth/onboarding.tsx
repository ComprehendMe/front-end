import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ApiError, completeOnboarding, getMe } from '@/lib/api';
import {
	COLLEGE_OPTIONS,
	emptySignupDraft,
	type SignupDraft,
} from '@/components/auth/signup-constants';
import {
	SignupFooter,
	SignupProgress,
	signupFieldClassName,
} from '@/components/auth/signup-progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/auth/onboarding')({
	component: OnboardingPage,
});

function OnboardingPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [step, setStep] = useState<2 | 3>(2);
	const [loading, setLoading] = useState(false);
	const [checking, setChecking] = useState(true);
	const [draft, setDraft] = useState<SignupDraft>(emptySignupDraft);
	const [dobOpen, setDobOpen] = useState(false);

	useEffect(() => {
		void (async () => {
			try {
				const me = await getMe();
				if (me.onboardingCompleted) {
					await navigate({ to: '/dashboard' });
					return;
				}
			} catch {
				await navigate({ to: '/' });
				return;
			} finally {
				setChecking(false);
			}
		})();
	}, [navigate]);

	const selectedDob = draft.dateOfBirth
		? new Date(`${draft.dateOfBirth}T12:00:00`)
		: undefined;

	async function finishOnboarding() {
		setLoading(true);
		try {
			await completeOnboarding({
				dateOfBirth: draft.dateOfBirth,
				college: draft.college,
				referralSource: draft.referralSource,
			});
			await navigate({ to: '/dashboard' });
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('auth.onboarding_toast_error'),
			);
		} finally {
			setLoading(false);
		}
	}

	if (checking) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<p className="text-muted-foreground">{t('auth.onboarding_loading')}</p>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-background px-fluid-container py-10">
			<div
				className={cn(
					'pointer-events-none absolute inset-0',
					'bg-size-[32px_32px]',
					'bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
				)}
			/>
			<div className="relative z-10 w-full max-w-[min(95vw,444px)] rounded-md border bg-white px-fluid-lg py-fluid-xl shadow-lg">
				{step === 2 ? (
					<div className="flex flex-col gap-6">
						<SignupProgress step={2} />
						<div className="space-y-5 text-left">
							<div className="space-y-2">
								<Label className="text-[16px] font-medium text-[#1C1F22]">
									{t('auth.onboarding_step2_dob_label')}
								</Label>
								<Popover open={dobOpen} onOpenChange={setDobOpen}>
									<PopoverTrigger asChild>
										<button
											type="button"
											className={cn(
												signupFieldClassName(),
												'justify-between text-left',
												!draft.dateOfBirth && 'text-[#4B4E58]',
											)}
										>
											{selectedDob
												? format(selectedDob, 'MMMM d yyyy')
												: t('auth.onboarding_step2_dob_placeholder')}
											<span className="text-[#4B4E58]" aria-hidden>
												▾
											</span>
										</button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={selectedDob}
											onSelect={(date) => {
												if (!date) return;
												setDraft((prev) => ({
													...prev,
													dateOfBirth: format(date, 'yyyy-MM-dd'),
												}));
												setDobOpen(false);
											}}
											disabled={(date) => date > new Date()}
											captionLayout="dropdown"
											fromYear={1940}
											toYear={new Date().getFullYear()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label className="text-[16px] font-medium text-[#1C1F22]">
									{t('auth.onboarding_step2_college_label')}
								</Label>
								<select
									value={draft.college}
									onChange={(e) =>
										setDraft((prev) => ({ ...prev, college: e.target.value }))
									}
									className={signupFieldClassName(
										!draft.college ? 'text-[#4B4E58]' : undefined,
									)}
								>
									<option value="" disabled>
										{t('auth.onboarding_step2_college_placeholder')}
									</option>
									{COLLEGE_OPTIONS.map((college) => (
										<option
											key={college}
											value={college}
											className="text-[#1C1F22]"
										>
											{college}
										</option>
									))}
								</select>
							</div>
						</div>
						<SignupFooter
							onBack={() => void navigate({ to: '/dashboard' })}
							primaryLabel={t('components.signup-wizard.continue')}
							onPrimary={() => {
								if (!draft.dateOfBirth) {
									toast.error(t('auth.onboarding_step2_toast_dob'));
									return;
								}
								if (!draft.college) {
									toast.error(t('auth.onboarding_step2_toast_college'));
									return;
								}
								setStep(3);
							}}
						/>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<SignupProgress step={3} />
						<div className="space-y-4 border-t border-[#E8EEF4] pt-6 text-left">
							<div>
								<p className="text-[16px] font-medium text-[#1C1F22]">
									{t('auth.onboarding_step3_heading')}
								</p>
								<p className="mt-1 text-[14px] font-normal text-[#4B4E58]">
									{t('auth.onboarding_step3_hint')}
								</p>
							</div>
							<RadioGroup
								value={draft.referralSource}
								onValueChange={(value) =>
									setDraft((prev) => ({ ...prev, referralSource: value }))
								}
								className="gap-4"
							>
								{[
									{ value: 'friends', label: t('auth.onboarding_step3_option_friends') },
									{ value: 'university', label: t('auth.onboarding_step3_option_university') },
									{ value: 'recommendation', label: t('auth.onboarding_step3_option_recommendation') },
									{ value: 'others', label: t('auth.onboarding_step3_option_others') },
								].map((option) => (
									<label
										key={option.value}
										htmlFor={`onboarding-${option.value}`}
										className="flex cursor-pointer items-center gap-3 text-[16px] font-normal text-[#1C1F22]"
									>
										<RadioGroupItem
											value={option.value}
											id={`onboarding-${option.value}`}
											className="size-5 border-[#0077A6] text-[#0077A6]"
										/>
										{option.label}
									</label>
								))}
							</RadioGroup>
						</div>
						<SignupFooter
							onBack={() => setStep(2)}
							primaryLabel={loading ? t('auth.onboarding_loading') : t('auth.signup_create_button')}
							primaryDisabled={loading}
							onPrimary={() => void finishOnboarding()}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
