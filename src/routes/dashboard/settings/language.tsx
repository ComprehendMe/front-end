import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/language")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full border-l h-full py-8 px-8">
        <h3 className="text-[18px] font-semibold text-[#4B4E58]">
          Language {"&"} time
        </h3>
        <Separator className="mt-3.5" />
        <div className="flex flex-col gap-10 mt-7">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-[16px] text-[#4B4E58]">
                Select a language
              </p>
              <span className="font-regular text-sm text-gray-400">
                choose the language you want comprehendme to display.
              </span>
            </div>
            <Input className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-[16px] text-[#4B4E58]">
              Formato de tempo
            </p>
            <RadioGroup>
              <div className="flex items-center space-x-2 bg-[#F0F5FA] py-2.5 px-5 rounded-lg">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one" className="text-sm font-normal w-full text-[#4B4E58]">12 hours</Label>
              </div>
              <div className="flex items-center space-x-2.5 bg-[#F0F5FA] py-2.5 px-5 rounded-lg w-full">
                <RadioGroupItem value="option-two" id="option-two"  />
                <Label htmlFor="option-two" className="text-sm font-normal w-full text-[#4B4E58]">24 hours</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
