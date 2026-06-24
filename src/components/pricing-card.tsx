"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthDialog from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface PricingFeature {
	text: string;
}

interface PricingPlan {
	id: string;
	name: string;
	monthlyPrice: string;
	yearlyPrice: string;
	features: PricingFeature[];
	button?: {
		text: string;
		url: string;
	};
}

interface Pricing2Props {
	heading?: string;
	plans?: PricingPlan[];
}

function usePricingPlans(): { heading: string; plans: PricingPlan[] } {
	const { t } = useTranslation();

	return {
		heading: t('pricing.heading'),
		plans: [
			{
				id: "free",
				name: t('pricing.free_plan_name'),
				monthlyPrice: t('pricing.free_monthly_price'),
				yearlyPrice: t('pricing.free_yearly_price'),
				features: [
					{ text: t('pricing.free_feature_1') },
					{ text: t('pricing.free_feature_2') },
					{ text: t('pricing.free_feature_3') },
					{ text: t('pricing.free_feature_4') },
					{ text: t('pricing.free_feature_5') },
					{ text: t('pricing.free_feature_6') },
				],
			},
			{
				id: "premium",
				name: t('pricing.premium_plan_name'),
				monthlyPrice: t('pricing.premium_monthly_price'),
				yearlyPrice: t('pricing.premium_yearly_price'),
				features: [
					{ text: t('pricing.premium_feature_1') },
					{ text: t('pricing.premium_feature_2') },
					{ text: t('pricing.premium_feature_3') },
					{ text: t('pricing.premium_feature_4') },
					{ text: t('pricing.premium_feature_5') },
					{ text: t('pricing.premium_feature_6') },
				],
				button: {
					text: t('pricing.premium_button'),
					url: "/",
				},
			},
		],
	};
}

const PricingSection = ({
	heading: headingProp,
	plans: plansProp,
}: Pricing2Props) => {
	const { t } = useTranslation();
	const defaults = usePricingPlans();
	const heading = headingProp ?? defaults.heading;
	const plans = plansProp ?? defaults.plans;
	const [isYearly, setIsYearly] = useState(false);
	return (
		<section className="py-fluid-section lg:py-fluid-xl">
			<div className="container">
				<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
					<h2 className="text-pretty text-fluid-3xl font-bold">{heading}</h2>
					<div className="flex items-center gap-3 text-lg">
						<Tabs
							value={isYearly ? "annual" : "monthly"}
							onValueChange={(value) => setIsYearly(value === "annual")}
							defaultValue="monthly"
						>
							<TabsList>
								<TabsTrigger value="monthly">{t('pricing.tab_monthly')}</TabsTrigger>
								<TabsTrigger value="annual">{t('pricing.tab_annual')}</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<div className="flex flex-col items-stretch gap-fluid-lg md:flex-row">
						{plans.map((plan) => (
							<Card
								key={plan.id}
								className="flex w-full max-w-[420px] 4xl:max-w-[540px] rounded-[20px] py-fluid-lg gap-fluid-lg flex-col justify-between text-left"
							>
								<CardHeader className="gap-2">
									<p className="font-normal text-fluid-xl">{plan.name}</p>
									<div className="flex items-end gap-2">
										<span className="text-3xl font-bold">
											{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
										</span>
									<span className="text-muted-foreground text-fluid-base font-normal">
										{isYearly ? t('pricing.billing_yearly') : t('pricing.billing_monthly')}
									</span>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3.5">
										{plan.features.map((feature, index) => (
											<li
												key={index}
												className="flex items-center gap-2 text-fluid-sm font-normal"
											>
												<Check className="size-4 text-blue-500" />
												<span>{feature.text}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter className="mt-auto">
									{plan?.button ? (
										<AuthDialog
											trigger={
												<Button className="h-[50px] w-full rounded-full px-6 text-fluid-base font-medium text-white">
													{plan.button.text}
												</Button>
											}
										/>
									) : null}
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export { PricingSection };
