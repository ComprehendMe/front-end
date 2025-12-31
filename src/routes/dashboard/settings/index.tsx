import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <main className="py-7">
      <div className="bg-white border border-[#1C1F22]/15 rounded-t-[20px] h-screen overflow-hidden">
        <h3 className="ml-12 my-[38px] font-semibold text-2xl">Settings</h3>
        <Separator />
        <div className="flex justify-between w-full h-full">
          <aside className="py-8 pl-12 pr-9 max-w-[260px] w-full">
            <div className="">
              <p className="text-sm font-semibold text-gray-400">General Settings</p>
              <ul className="space-y-2">
                <li className="bg-blue-200 flex gap-2 items-center px-[18px] text-[#4B4E58] rounded-2xl py-3">
                  <User />
                  <span>Account</span>
                </li>
                <li className=" flex gap-2 items-center px-[18px] rounded-2xl text-[#4B4E58] py-3">
                  <Bell />
                  <span>Notification</span>
                </li>
                <li className=" flex gap-2 items-center px-[18px] text-[#4B4E58] rounded-2xl py-3">
                  <Globe />
                  <span>Language {"&"} time</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400">General Settings</p>
              <ul>
                <li>Account</li>
                <li>Notification</li>
                <li>Language {"&"} time</li>
              </ul>
            </div>
          </aside>
          <div className="flex flex-col w-full border-l h-full py-8 px-8">
            <h3 className="text-[18px] font-semibold text-[#1C1F22]">My Profile</h3>
            <Separator className="mt-3.5"/>
            <div className="flex flex-col mt-6">
              <p className="font-semibold text-[16px] text-[#1C1F22]">Profile photo</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
