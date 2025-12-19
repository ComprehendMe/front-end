import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NavItem } from "./types";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
	return (
		href === item.url || // /endpint?search=param
		href.split("?")[0] === item.url || // endpoint
		!!item?.items?.filter((i) => i.url === href).length || // se o child da nav é ativo
		(mainNav &&
			href.split("/")[1] !== "" &&
			href.split("/")[1] === item?.url?.split("/")[1])
	);
}

export { cn, checkIsActive };
