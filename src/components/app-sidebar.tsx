import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const href = useLocation({ select: (l) => l.href });

  const isInConversation =
    href.startsWith("/dashboard/conversations") ||
    href.startsWith("/dashboard/chat/");

  const information: { name: string; items: NavLink[] }[] = [
    {
      name: t('dashboard.layout.sidebar_section_overview'),
      items: [],
    },
    {
      name: t('dashboard.layout.sidebar_section_settings'),
      items: [
        {
          title: t('dashboard.layout.nav_settings'),
          url: "/dashboard/settings",
          icon: SettingsIcon,
        },
        {
          title: t('dashboard.layout.nav_logout'),
          url: "/",
          icon: LogoutIcon,
          isLogout: true,
        },
      ],
    },
  ];

  const overviewItems: NavLink[] = [
    {
      title: t('dashboard.layout.nav_dashboard'),
      url: "/dashboard",
      icon: DashboardIcon,
      exact: true,
    },
    ...(isInConversation
      ? [
          {
            title: t('dashboard.layout.nav_conversations'),
            url: "/dashboard" as const,
            icon: ConversationsIcon,
          },
        ]
      : []),
    {
      title: t('dashboard.layout.nav_history'),
      url: "/dashboard/history",
      icon: HistoryIcon,
    },
  ];

  const overviewSection = { ...information[0], items: overviewItems };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <img src="/logo.svg" alt={t('dashboard.layout.sidebar_logo_alt')} className="w-10 h-10" />
            <h1 className="font-semibold text-[16px] text-primary">
              {t('dashboard.layout.sidebar_app_name')}
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
