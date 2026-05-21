import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NavItem } from "./types";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function checkIsActive(href: string, item: NavItem): boolean {
	const path = href.split("?")[0].replace(/\/$/, "") || "/";

	if ("items" in item && item.items?.length) {
		return item.items.some((child) => {
			if (!child.url) return false;
			return checkIsActive(href, {
				title: child.title,
				url: child.url,
				icon: child.icon,
			});
		});
	}

	if (!("url" in item) || !item.url) return false;

	const target = String(item.url).replace(/\/$/, "") || "/";

	if ("exact" in item && item.exact) {
		return path === target;
	}

	return path === target || path.startsWith(`${target}/`);
}

export { cn, checkIsActive };
