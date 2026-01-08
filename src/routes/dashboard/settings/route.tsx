import { ListTab } from "@/components/dashboard/tabs-list"
import { Separator } from "@/components/ui/separator";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, Globe } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <main className="py-7">
      <div className="bg-white border border-[#1C1F22]/15 rounded-t-[20px]">
        <h3 className="ml-12 my-[38px] font-semibold text-2xl">Settings</h3>
        <Separator />
        <div className="flex justify-between w-full h-full">
          <aside className="py-8 pl-12 pr-9 max-w-[260px] w-full space-y-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                General Settings
              </p>
              <ListTab
                tabs={[
                  {
                    name: "Account",
                    value: "/",
                    icon: <Bell />,
                  },
                  {
                    name: "Notifications",
                    value: "/notifications",
                    icon: <Bell />,
                  },
                  {
                    name: "Language & time",
                    value: "/language",
                    icon: <Bell />,
                  },
                ]}
                url="/dashboard/settings"
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                Workspace Settings
              </p>
              <ListTab
                tabs={[
                  {
                    name: "Friends",
                    value: "/friends",
                    icon: <Bell />,
                  },
                  {
                    name: "Billing",
                    value: "/billing",
                    icon: <Bell />,
                  },
                ]}
                url="/dashboard"
              />
            </div>
          </aside>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
