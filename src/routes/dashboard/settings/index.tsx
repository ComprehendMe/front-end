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
        <h3 className="text-[18px] font-semibold text-[#1C1F22]">My Profile</h3>
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
        <h3 className="text-[18px] font-semibold text-[#1C1F22]">
          Account security
        </h3>
        <Separator className="mt-3.5" />
      </div>
    </div>
  );
}
