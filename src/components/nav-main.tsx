import type { Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { checkIsActive, cn } from "@/lib/utils";
import type { NavLink } from "@/lib/types";

export default function NavMain({ information }: { information: { name: string, items: NavLink[] } }) {
  const { isMobile } = useSidebar();
  const href = useLocation({ select: (location) => location.href });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{information.name}</SidebarGroupLabel>
      <SidebarMenu>
        {information.items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={checkIsActive(href, item)}
              tooltip={item.title}
            >
              <Link to={item.url} className={cn(item.title === "To go out" && "text-red-500")}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
