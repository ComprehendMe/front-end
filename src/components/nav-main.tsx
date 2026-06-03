import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { logout } from "@/lib/api";
import type { NavLink } from "@/lib/types";
import { checkIsActive } from "@/lib/utils";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";

export default function NavMain({
	information,
}: {
	information: { name: string; items: NavLink[] };
}) {
	const { t } = useTranslation();
	const href = useLocation({ select: (location) => location.href });
	const navigate = useNavigate();

	async function handleLogout() {
		try {
			await logout();
			await navigate({ to: "/" });
		} catch {
			toast.error(t('dashboard.layout.nav_logout_toast'));
		}
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="mb-1">{information.name}</SidebarGroupLabel>
			<SidebarMenu>
				{information.items.map((item) => {
					const isActive = checkIsActive(href, item);

					if (item.isLogout) {
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									className="text-[#d96565] hover:text-[#c75454]"
									onClick={() => void handleLogout()}
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={isActive}
								tooltip={item.title}
							>
								<Link to={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
