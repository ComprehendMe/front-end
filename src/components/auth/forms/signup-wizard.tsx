import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { ApiError, signup } from '@/lib/api';
import { cn } from '@/lib/utils';
import { GoogleSignInButton } from '../google-sign-in-button';
import {
	COLLEGE_OPTIONS,
	emptySignupDraft,
	type SignupDraft,
} from '../signup-constants';
import {
	SignupFooter,
	SignupProgress,
	signupFieldClassName,
} from '../signup-progress';
import { SignUpFormSchema } from '../auth';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

type SignupWizardProps = {
	onBackToLogin: () => void;
	onEmailSent: (email: string) => void;
	onStepChange?: (step: 1 | 2 | 3) => void;
};

export default function SignupWizard({
	onBackToLogin,
	onEmailSent,
	onStepChange,
}: SignupWizardProps) {
	const [step, setStep] = useState<1 | 2 | 3>(1);

	function goToStep(next: 1 | 2 | 3) {
		setStep(next);
		onStepChange?.(next);
	}
	const [loading, setLoading] = useState(false);
	const [draft, setDraft] = useState<SignupDraft>(emptySignupDraft);
	const [dobOpen, setDobOpen] = useState(false);

	const signUpForm = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { name: '', email: '' },
	});

	const selectedDob = draft.dateOfBirth
		? new Date(`${draft.dateOfBirth}T12:00:00`)
		: undefined;

	async function submitSignup() {
		setLoading(true);
		try {
			await signup({
				email: draft.email,
				name: draft.name,
				dateOfBirth: draft.dateOfBirth,
				college: draft.college,
				referralSource: draft.referralSource,
			});
			onEmailSent(draft.email);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : 'Could not create account.',
			);
		} finally {
			setLoading(false);
		}
	}

	function goToStep2() {
		void signUpForm.handleSubmit((values) => {
			setDraft((prev) => ({ ...prev, name: values.name, email: values.email }));
			goToStep(2);
		})();
	}

	function goToStep3() {
		if (!draft.dateOfBirth) {
			toast.error('Please select your date of birth.');
			return;
		}
		if (!draft.college) {
			toast.error('Please select your college.');
			return;
		}
		goToStep(3);
	}

	if (step === 1) {
		return (
			<>
				<Form {...signUpForm}>
					<form
						className="flex w-full flex-col gap-4 text-center"
						onSubmit={(e) => {
							e.preventDefault();
							goToStep2();
						}}
					>
						<GoogleSignInButton disabled={loading} />
						<p className="text-[16px] font-normal text-[#1C1F22]">or</p>
						<FormField
							control={signUpForm.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Name"
											className={signupFieldClassName()}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={signUpForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="E-mail"
											className={signupFieldClassName()}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SignupFooter
							onBack={onBackToLogin}
							primaryLabel={loading ? 'Sending…' : 'Continue'}
							primaryDisabled={loading}
							primaryType="submit"
						/>
					</form>
				</Form>
			</>
		);
	}

	if (step === 2) {
		return (
			<div className="flex w-full flex-col gap-6">
				<SignupProgress step={2} />
				<div className="space-y-5 text-left">
					<div className="space-y-2">
						<Label className="text-[16px] font-medium text-[#1C1F22]">
							What is your date of birth?
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
										: 'Select your date of birth'}
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
							Where do you study?
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
								Select your college
							</option>
							{COLLEGE_OPTIONS.map((college) => (
								<option key={college} value={college} className="text-[#1C1F22]">
									{college}
								</option>
							))}
						</select>
					</div>
				</div>
				<SignupFooter
					onBack={() => goToStep(1)}
					primaryLabel="Continue"
					onPrimary={goToStep3}
				/>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<SignupProgress step={3} />
			<div className="space-y-4 border-t border-[#E8EEF4] pt-6 text-left">
				<div>
					<p className="text-[16px] font-medium text-[#1C1F22]">
						How did you hear about us?
					</p>
					<p className="mt-1 text-[14px] font-normal text-[#4B4E58]">
						Pick one option - It will help us improve
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
						{ value: 'friends', label: 'Friends' },
						{ value: 'university', label: 'University/School' },
						{ value: 'recommendation', label: 'Recommendation' },
						{ value: 'others', label: 'Others' },
					].map((option) => (
						<label
							key={option.value}
							htmlFor={`referral-${option.value}`}
							className="flex cursor-pointer items-center gap-3 text-[16px] font-normal text-[#1C1F22]"
						>
							<RadioGroupItem
								value={option.value}
								id={`referral-${option.value}`}
								className="size-5 border-[#0077A6] text-[#0077A6] data-[state=checked]:border-[#0077A6]"
							/>
							{option.label}
						</label>
					))}
				</RadioGroup>
			</div>
			<SignupFooter
				onBack={() => goToStep(2)}
				primaryLabel={loading ? 'Creating…' : 'Create account'}
				primaryDisabled={loading}
				onPrimary={() => void submitSignup()}
			/>
		</div>
	);
}
