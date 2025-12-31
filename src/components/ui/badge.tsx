import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const customBadges = {
	easy: {
		text: "Easy",
		className: "bg-[#CDF8D0] text-[#07720F]",
	},
	medium: {
		text: "Medium",
		className: "bg-[#F8F8CD] text-[#726B07]",
	},
	hard: {
		text: "Hard",
		className: "bg-[#F8CDCD] text-[#722407]",
	},
	emotional: {
		text: "Emotional problems",
		className: "bg-[#EEF5D5] text-[#576D09]",
	},
	problems: {
		text: "Problems at school/work",
		className: "bg-[#CDECF8] text-[#075472]",
	},
	adaptation: {
		text: "Adaptation Problems",
		className: "bg-[#CDD6F8] text-[#071672]",
	},
	relational: {
		text: "Relational and social problems",
		className: "bg-[#F8D8CD] text-[#542A0F]",
	},
	developmental: {
		text: "Developmental/Behavioral Problems",
		className: "bg-[#CDF8D0] text-[#07720F]",
	},
	identity: {
		text: "Identity and Self-Image",
		className: "bg-[#F0CDF8] text-[#72076B]",
	},
	traumatic: {
		text: "Traumatic Problems",
		className: "bg-[#F8CDE8] text-[#720766]",
	},
	risky: {
		text: "Risky Behavior Problems",
		className: "bg-[#CDF8F0] text-[#075272]",
	},
} as const;

type CustomVariant = keyof typeof customBadges;

const customVariants = Object.fromEntries(
	Object.entries(customBadges).map(([key, value]) => [key, value.className]),
) as Record<CustomVariant, string>;

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				...customVariants,
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface BadgeProps extends Omit<React.ComponentProps<"span">, "children"> {
	variant?: BadgeVariant;
	asChild?: boolean;
	children?: React.ReactNode;
}

function Badge({
	className,
	variant,
	asChild = false,
	children,
	...props
}: BadgeProps) {
	const Comp = asChild ? Slot : "span";

	const autoText =
		!children && variant && variant in customBadges
			? customBadges[variant as CustomVariant].text
			: children;

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		>
			{autoText}
		</Comp>
	);
}

export { Badge, badgeVariants };
