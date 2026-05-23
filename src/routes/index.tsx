import { createFileRoute } from '@tanstack/react-router';
import Footer from '@/components/footer';
import Header from '@/components/header';
import MissionSection from '@/components/mission-section';
import AuthDialog from '@/components/auth/auth-dialog';
import { PricingSection } from '@/components/pricing-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	return (
		<>
			<div className="min-h-screen bg-background">
				<div
					className={cn(
						'absolute inset-0',
						'bg-size-[32px_32px]',
						'bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
						'dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]',
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background mask-[linear-gradient(to_bottom,transparent_0%,black)] dark:bg-black" />
				<div className="relative z-20 px-20 py-10">
					<Header />
					<main className="z-50 mt-44 flex flex-col items-center justify-center text-center">
						<div className="flex flex-col items-center gap-5">
							<h1 className="text-[40px] font-bold text-foreground">
								Practice without fear. Serve without hesitation.
							</h1>
							<p className="max-w-4xl text-lg font-medium tracking-tight text-foreground">
								Realistic virtual patients, immediate feedback, and a safe
								environment for you to grow as a therapist.
							</p>
							<AuthDialog
								trigger={
									<Button size="lg" className="w-fit rounded-full px-6 text-lg">
										Get started
									</Button>
								}
							/>
						</div>
					</main>
					<section
						id="benefits"
						className="m-auto mt-40 grid grid-cols-3 gap-[30px]"
					>
						<div className="z-50 space-y-5 rounded-xl border border-border bg-card p-5 shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
							<div className="flex w-fit items-center justify-center rounded-lg bg-linear-to-tr from-[#073E84] from-10% via-[#0978AA] via-90% to-[#1C97C8] p-4">
								<img
									src="/Group.svg"
									alt="Choose a patient"
									className="h-7 w-7 object-contain"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-lg font-medium">Choose a patient</p>
								<p className="text-[16px] font-normal text-muted-foreground">
									Clinical profiles with varying levels of difficulty and
									behaviors.
								</p>
							</div>
						</div>
						<div className="z-50 space-y-5 rounded-xl border border-border bg-card p-5 shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
							<div className="flex w-fit items-center justify-center rounded-lg bg-linear-to-tr from-[#073E84] from-10% via-[#0978AA] via-90% to-[#1C97C8] p-4">
								<img
									src="/Vector.svg"
									alt="Chat in real time"
									className="h-7 w-7 object-contain"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-lg font-medium">Chat in real time</p>
								<p className="text-[16px] font-normal text-muted-foreground">
									Consistent and contextual AI, with emotional cues and natural
									pacing.
								</p>
							</div>
						</div>
						<div className="z-50 space-y-5 rounded-xl border border-border bg-card p-5 shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
							<div className="flex w-fit items-center justify-center rounded-lg bg-linear-to-tr from-[#073E84] from-10% via-[#0978AA] via-90% to-[#1C97C8] p-4">
								<img
									src="/carbon_report.svg"
									alt="Receive a report"
									className="h-7 w-7 object-contain"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-lg font-medium">Receive a report</p>
								<p className="text-[16px] font-normal text-muted-foreground">
									Analyses of empathy, coherence, and key moments, with
									recommendations.
								</p>
							</div>
						</div>
					</section>
					<div id="pricing">
						<PricingSection />
					</div>
					<MissionSection />
				</div>
			</div>
			<Footer />
		</>
	);
}
