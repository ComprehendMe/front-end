import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
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
              <div className="space-y-2">
                <Button className="h-[45px] w-full justify-start text-[#4B4E58] bg-blue-200 rounded-2xl">
                  <User className="ml-2" />
                  <span className="font-semibold">Account</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-[45px] w-full justify-start rounded-2xl text-[#4B4E58]"
                >
                  <Bell className="ml-2" />
                  <span className="font-semibold">Notification</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-[45px] w-full justify-start text-[#4B4E58] rounded-2xl"
                >
                  <Globe className="ml-2" />
                  <span className="font-semibold">Language {"&"} time</span>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-400">
                Workspace Settings
              </p>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="h-[45px] w-full justify-start rounded-2xl text-[#4B4E58]"
                >
                  <Bell className="ml-2" />
                  <span className="font-semibold">Friends</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-[45px] w-full justify-start text-[#4B4E58] rounded-2xl"
                >
                  <Globe className="ml-2" />
                  <span className="font-semibold">Billing</span>
                </Button>
              </div>
            </div>
          </aside>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full border-l h-full py-8 px-8">
              <h3 className="text-[18px] font-semibold text-[#1C1F22]">
                My Profile
              </h3>
              <Separator className="mt-3.5" />
              <div className="flex flex-col gap-5">
                <div className="flex flex-col mt-5 gap-[18px]">
                  <p className="font-semibold text-[16px] text-gray-500">
                    Profile photo
                  </p>
                  <div className="flex gap-4 items-center">
                    <Avatar className="w-[120px] h-[120px]">
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <Button className="rounded-full">Change Image</Button>
                        <Button className="rounded-full" variant="secondary">
                          Remove Image
                        </Button>
                      </div>
                      <p className="text-sm text-[#757575] font-medium">
                        We support PNGs, JPGs and GIFs under 2MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 w-full gap-3.5">
                  <div className="flex flex-col gap-5">
                    <p className="font-semibold text-[16px] text-[#4B4E58]">
                      First name
                    </p>
                    <Input className="w-full bg-gray-100" placeholder="Joana" />
                  </div>
                  <div className="flex flex-col gap-5">
                    <p className="font-semibold text-[16px] text-[#4B4E58]">
                      Last name
                    </p>
                    <Input
                      className="w-full bg-gray-100"
                      placeholder="Almeida"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full border-l h-full py-8 px-8">
              <h3 className="text-[18px] font-semibold text-[#1C1F22]">
                  Account security
              </h3>
              <Separator className="mt-3.5" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
