import { useLocation } from "@tanstack/react-router";
import {
  DashboardIcon,
  HistoryIcon,
  ConversationsIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/components/ui/sidebar-icons";
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
    items: [],
  },
  {
    name: "Settings",
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: SettingsIcon,
      },
      {
        title: "Log out",
        url: "/",
        icon: LogoutIcon,
        isLogout: true,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const href = useLocation({ select: (l) => l.href });

  const isInConversation =
    href.startsWith("/dashboard/conversations") ||
    href.startsWith("/dashboard/chat/");

  const overviewItems: NavLink[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      exact: true,
    },
    ...(isInConversation
      ? [
          {
            title: "Conversations",
            url: "/dashboard" as const,
            icon: ConversationsIcon,
          },
        ]
      : []),
    {
      title: "History",
      url: "/dashboard/history",
      icon: HistoryIcon,
    },
  ];

  const overviewSection = { ...information[0], items: overviewItems };

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
        <NavMain information={overviewSection} />
        <NavMain information={information[1]} />
      </SidebarContent>
    </Sidebar>
  );
}
