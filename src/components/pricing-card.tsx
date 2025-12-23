"use client";

import { Check } from "lucide-react";
import { useState } from "react";

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
	description?: string;
	plans?: PricingPlan[];
}

const PricingSection = ({
	heading = "Pricing",
	plans = [
		{
			id: "free",
			name: "Free",
			monthlyPrice: "€0",
			yearlyPrice: "€0",
			features: [
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
			],
		},
		{
			id: "premium",
			name: "Premium",
			monthlyPrice: "€40",
			yearlyPrice: "€40",
			features: [
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
				{ text: "Figma ipsum component" },
			],
			button: {
				text: "Get Premium",
				url: "/",
			},
		},
	],
}: Pricing2Props) => {
	const [isYearly, setIsYearly] = useState(false);
	return (
		<section className="pb-32 pt-36">
			<div className="container">
				<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
					<h2 className="text-pretty text-[32px] font-bold">{heading}</h2>
					<div className="flex items-center gap-3 text-lg">
						<Tabs
							value={isYearly ? "annual" : "monthly"}
							onValueChange={(value) => setIsYearly(value === "annual")}
							defaultValue="annual"
						>
							<TabsList>
								<TabsTrigger value="monthly">Monthly</TabsTrigger>
								<TabsTrigger value="annual">Annual</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<div className="flex flex-col items-stretch gap-[30px] md:flex-row">
						{plans.map((plan) => (
							<Card
								key={plan.id}
								className="flex w-[420px] rounded-[20px] py-[30px] gap-7 flex-col justify-between text-left"
							>
								<CardHeader className="gap-2">
									<p className="font-normal text-[24px]">{plan.name}</p>
									<div className="flex items-end gap-2">
										<span className="text-3xl font-bold">
											{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
										</span>
										<span className="text-muted-foreground text-[18px] font-normal">
											{isYearly ? "euros/year" : "euros/month"}
										</span>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3.5">
										{plan.features.map((feature, index) => (
											<li
												key={index}
												className="flex items-center gap-2 text-[16px] font-normal"
											>
												<Check className="size-4 text-blue-500" />
												<span>{feature.text}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter className="mt-auto">
									{plan?.button && (
										<Button
											asChild
											className="w-full rounded-full px-6 h-[50px]"
										>
											<a href={plan.button?.url} className="text-[18px] font-medium" target="_blank">
												{plan.button?.text}
											</a>
										</Button>
									)}
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
