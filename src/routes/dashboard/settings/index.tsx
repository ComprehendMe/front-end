import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DashboardButton } from "@/components/dashboard/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-lg font-semibold text-[#4B4E58]">My Profile</h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col mt-5 gap-[18px]">
            <p className="font-semibold text-[16px] text-[#4B4E58]">
              Profile photo
            </p>
            <div className="flex gap-4 items-center">
              <Avatar className="w-[120px] h-[120px]">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <DashboardButton className="rounded-full">
                    Change Image
                  </DashboardButton>
                  <DashboardButton className="rounded-full" variant="secondary">
                    Remove Image
                  </DashboardButton>
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
              <Input className="w-full bg-gray-100" placeholder="Almeida" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-[18px] font-semibold text-[#4B4E58]">
          Account security
        </h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-3.5 w-full mt-5">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-[#4B4E58]">Email</p>
            <div className="flex w-full justify-between">
              <Input
                disabled
                placeholder="joanaalmeida@gmail.com"
                className="max-w-[390px]"
              />
              <DashboardButton className="rounded-full" variant="secondary">
                Change email
              </DashboardButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-[#4B4E58]">Password</p>
            <div className="flex w-full justify-between">
              <Input disabled placeholder="Almeida" className="max-w-[390px]" />
              <DashboardButton className="rounded-full" variant="secondary">
                Change password
              </DashboardButton>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-[18px] font-semibold text-[#4B4E58]">
          Support Access
        </h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-5 w-full mt-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#4B4E58]">
                Log out of all devices
              </p>
              <span className="font-normal text-sm text-[#757575] tracking-tight">
                Log out of all other active sessions on other devices besides
                this one.
              </span>
            </div>
            <DashboardButton className="rounded-full" variant="secondary">
              Log out
            </DashboardButton>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#EF4444]">
                  Delete my account
              </p>
              <span className="font-normal text-sm text-[#757575] tracking-tight">
                  Permanently delete the account and remove access from all workspaces.
              </span>
            </div>
            <DashboardButton className="rounded-full" variant="secondary">
                Delete account
            </DashboardButton>
          </div>
        </div>
      </div>
    </div>
  );
}
