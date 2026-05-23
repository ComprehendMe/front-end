import {
	IconChartBar,
	IconDashboard,
	IconLogout,
	IconSettings,
} from "@tabler/icons-react";
import type { NavLink } from "@/lib/types";
import NavMain from "./nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "./ui/sidebar";

const information: { name: string; items: NavLink[] }[] = [
	{
		name: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: IconDashboard,
				exact: true,
			},
			{
				title: "History",
				url: "/dashboard/history",
				icon: IconChartBar,
			},
		],
	},
	{
		name: "Settings",
		items: [
			{
				title: "Settings",
				url: "/dashboard/settings",
				icon: IconSettings,
			},
			{
				title: "Log out",
				url: "/",
				icon: IconLogout,
				isLogout: true,
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center">
						<img src="/logo.svg" alt="logo" className="w-10 h-10" />
						<h1 className="font-semibold text-[16px] text-primary">
							ComprehendMe
						</h1>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain information={information[0]} />
				<NavMain information={information[1]} />
			</SidebarContent>
		</Sidebar>
	);
}
