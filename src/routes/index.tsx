import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/footer';
import Header from '@/components/header';

import AuthDialog from '@/components/auth/auth-dialog';
import { PricingSection } from '@/components/pricing-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/')({
	head: () => ({
		meta: [
			{
				title: 'ComprehendMe — Practice without fear. Serve without hesitation.',
			},
			{
				name: 'description',
				content:
					'Realistic virtual patients, immediate feedback, and a safe environment for you to grow as a therapist.',
			},
			{ property: 'og:title', content: 'ComprehendMe' },
			{
				property: 'og:description',
				content:
					'Realistic virtual patients, immediate feedback, and a safe environment for you to grow as a therapist.',
			},
			{ property: 'og:type', content: 'website' },
			{ property: 'og:url', content: 'https://comprehendme.com' },
			{ property: 'og:image', content: '/og-image.webp' },
			{ property: 'og:locale', content: 'en_US' },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: 'ComprehendMe' },
			{
				name: 'twitter:description',
				content:
					'Realistic virtual patients, immediate feedback, and a safe environment for you to grow as a therapist.',
			},
			{ name: 'twitter:image', content: '/og-image.webp' },
		],
	}),
	component: App,
});

function App() {
	const { t } = useTranslation();
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
				<div className="relative z-20 px-fluid-container py-fluid-section">
					<Header />
					<main className="z-50 mt-[clamp(3rem,10vw,10rem)] flex flex-col items-center justify-center text-center">
						<div className="flex flex-col items-center gap-5">
							<h1 className="text-fluid-4xl 4xl:text-fluid-5xl font-bold text-foreground">
								{t('landing.hero_title')}
							</h1>
							<p className="max-w-[min(90vw,1200px)] text-fluid-base 4xl:text-fluid-xl font-medium tracking-tight text-foreground">
								{t('landing.hero_subtitle')}
							</p>
							<AuthDialog
								trigger={
									<Button size="lg" className="w-fit rounded-full px-6 text-lg">
										{t('landing.cta_button')}
									</Button>
								}
							/>
						</div>
					</main>
					<section
						id="benefits"
						className="m-auto mt-[clamp(3rem,8vw,9rem)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,clamp(280px,35vw,380px)),1fr))] gap-fluid-lg"
					>
						<div className="z-50 space-y-5 rounded-xl border border-border bg-card p-fluid-md shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
							<div className="flex w-fit items-center justify-center rounded-lg bg-[#0978AA] p-4">
								<img
									src="/Group.svg"
									alt={t('landing.benefit_1_alt')}
									className="h-7 w-7 object-contain"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-fluid-lg font-medium">{t('landing.benefit_1_title')}</p>
								<p className="text-fluid-sm font-normal text-muted-foreground">
									{t('landing.benefit_1_desc')}
								</p>
							</div>
						</div>
						<div className="z-50 space-y-5 rounded-xl border border-border bg-card p-fluid-md shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
							<div className="flex w-fit items-center justify-center rounded-lg bg-[#0978AA] p-4">
								<img
									src="/Vector.svg"
									alt={t('landing.benefit_2_alt')}
									className="h-7 w-7 object-contain"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-fluid-lg font-medium">{t('landing.benefit_2_title')}</p>
								<p className="text-fluid-sm font-normal text-muted-foreground">
									{t('landing.benefit_2_desc')}
								</p>
							</div>
						</div>
						<div className="z-50 space-y-5 rounded-xl border border-border bg-card p-fluid-md shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
							<div className="flex w-fit items-center justify-center rounded-lg bg-[#0978AA] p-4">
								<img
									src="/carbon_report.svg"
									alt={t('landing.benefit_3_alt')}
									className="h-7 w-7 object-contain"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-fluid-lg font-medium">{t('landing.benefit_3_title')}</p>
								<p className="text-fluid-sm font-normal text-muted-foreground">
									{t('landing.benefit_3_desc')}
								</p>
							</div>
						</div>
					</section>
					<div id="pricing">
						<PricingSection />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
