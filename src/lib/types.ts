import type { Icon } from "@tabler/icons-react";
import type { LinkProps } from "@tanstack/react-router";

interface BaseNavItem {
	title: string;
	icon?: Icon;
}

type NavLink = BaseNavItem & {
	url: LinkProps["to"];
	/** Só ativo quando o path é exatamente este URL */
	exact?: boolean;
	/** Termina sessão em vez de navegar */
	isLogout?: boolean;
	items?: never;
};

type NavCollapsible = BaseNavItem & {
	items: (BaseNavItem & { url: LinkProps["to"] })[];
	url?: never;
};

type NavItem = NavCollapsible | NavLink;

export type { NavItem, NavCollapsible, NavLink };
