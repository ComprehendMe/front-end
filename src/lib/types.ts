import type { LucideIcon } from "lucide-react";
import type { LinkProps } from "@tanstack/react-router";

interface BaseNavItem {
	title: string;
	icon?: LucideIcon;
}

type NavLink = BaseNavItem & {
	url: LinkProps["to"];
	/** Active only when the path matches this URL exactly */
	exact?: boolean;
	/** Signs out instead of navigating */
	isLogout?: boolean;
	items?: never;
};

type NavCollapsible = BaseNavItem & {
	items: (BaseNavItem & { url: LinkProps["to"] })[];
	url?: never;
};

type NavItem = NavCollapsible | NavLink;

export type { NavItem, NavCollapsible, NavLink };
