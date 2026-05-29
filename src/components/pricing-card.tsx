"use client";

import { Check } from "lucide-react";
import { useState } from "react";
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
				{ text: "Chat with 4 AI patient profiles" },
				{ text: "25 messages per day" },
				{ text: "Basic AI conversation review" },
				{ text: "Full session history" },
				{ text: "Progress and streak tracking" },
				{ text: "Connect with friends" },
			],
		},
		{
			id: "premium",
			name: "Premium",
			monthlyPrice: "€15",
			yearlyPrice: "€12",
			features: [
				{ text: "Unlimited messages per day" },
				{ text: "Advanced AI performance reviews" },
				{ text: "Downloadable session reports" },
				{ text: "All difficulty levels from Easy to Hard" },
				{ text: "Priority support" },
				{ text: "Premium profile badge" },
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
								<TabsTrigger value="monthly">Monthly</TabsTrigger>
								<TabsTrigger value="annual">Annual</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<div className="flex flex-col items-stretch gap-fluid-lg md:flex-row">
						{plans.map((plan) => (
							<Card
								key={plan.id}
								className="flex w-full max-w-[420px] rounded-[20px] py-fluid-lg gap-fluid-lg flex-col justify-between text-left"
							>
								<CardHeader className="gap-2">
									<p className="font-normal text-fluid-xl">{plan.name}</p>
									<div className="flex items-end gap-2">
										<span className="text-3xl font-bold">
											{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
										</span>
									<span className="text-muted-foreground text-fluid-base font-normal">
										{isYearly ? "/month, billed annually" : "/month"}
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
