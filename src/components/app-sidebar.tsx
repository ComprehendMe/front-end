import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";
import NavMain from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import type { NavLink } from "@/lib/types";

const items: NavLink[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Lifecycle",
    url: "/",
    icon: IconListDetails,
  },
  {
    title: "Analytics",
    url: "/",
    icon: IconChartBar,
  },
  {
    title: "Projects",
    url: "/",
    icon: IconFolder,
  },
  {
    title: "Team",
    url: "/",
    icon: IconUsers,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="border">
            <h1 className="font-semibold text-[16px] text-blue-600">
              ComprehendMe
            </h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
    </Sidebar>
  );
}
