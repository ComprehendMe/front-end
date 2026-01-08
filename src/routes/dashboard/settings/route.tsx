import { ListTab } from "@/components/dashboard/tabs-list";
import { Separator } from "@/components/ui/separator";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, Globe, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <main className="py-7">
      <div className="bg-white border border-[#1C1F22]/15 rounded-t-[20px]">
        <h3 className="ml-[30px] my-[38px] font-semibold text-2xl">Settings</h3>
        <Separator />
        <div className="flex justify-between w-full h-full">
          <aside className="py-8 pl-[30px] pr-9 max-w-[260px] w-full space-y-10">
            <ListTab
              tabs={{
                title: "Workspace Settings",
                items: [
                  {
                    name: "Account",
                    value: "/",
                    icon: <User />,
                  },
                  {
                    name: "Notifications",
                    value: "/notifications",
                    icon: <Bell />,
                  },
                  {
                    name: "Language & time",
                    value: "/language",
                    icon: <Globe />,
                  },
                ],
              }}
              url="/dashboard/settings"
            />
          </aside>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
