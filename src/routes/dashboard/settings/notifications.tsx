import { DashboardButton } from "@/components/dashboard/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/notifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-[18px] font-semibold text-[#4B4E58]">
          Notifications
        </h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-5 mt-7">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">
                Enable desktop notification
              </p>
              <span className="font-regular text-sm text-gray-400">
                Receive notifications for all messages, contracts, and
                documents.
              </span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">
                Enable unread notification badge
              </p>
              <span className="font-regular text-sm text-gray-400">
                Shows a red badge on the app icon when you have unread message.
              </span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-[#4B4E58]">
              Push notification Time-out
            </p>
            <Input placeholder="10 minutes" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">
                Enable desktop notification
              </p>
              <span className="font-regular text-sm text-gray-400">
                Receive notifications for all messages, contracts, and
                documents.
              </span>
            </div>
            <Switch />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-[18px] font-semibold text-[#4B4E58]">
          Email notifications
        </h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-5 mt-7">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">Communication emails</p>
              <span className="font-regular text-sm text-gray-400">
                Receive email for messages, contracts and documents.
              </span>
            </div>
            <Switch />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">
                Announcements and updates
              </p>
              <span className="font-regular text-sm text-gray-400">
                Receive email about product update, improvements, etc.
              </span>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-[18px] font-semibold text-[#4B4E58]">
            Sounds
        </h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-5 mt-7">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">Disable all notification sounds</p>
              <span className="font-regular text-sm text-gray-400">
                  Mute all notifications of the messages, contracts and documents.
              </span>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
