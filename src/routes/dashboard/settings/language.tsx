import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import type { TimeFormat } from "@/lib/user-preferences";
import { Route as DashboardRoute } from "../../dashboard";

export const Route = createFileRoute("/dashboard/settings/language")({
	component: LanguagePage,
});

function LanguagePage() {
	const id = useId();
	const { user } = DashboardRoute.useRouteContext();
	const { preferences, updatePreferences } = useUserPreferences(user.email);
	const option12Id = `${id}-12h`;
	const option24Id = `${id}-24h`;

	function handleTimeFormat(value: string) {
		const timeFormat: TimeFormat = value === "24h" ? "24h" : "12h";
		updatePreferences({ timeFormat });
		document.documentElement.lang = "en";
		toast.success("Language and time settings saved.");
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					Language & time
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-10">
					<div className="flex flex-col gap-4">
						<div className="space-y-2">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								Select a language
							</p>
							<span className="font-regular text-gray-400 text-sm">
								Choose the language you want ComprehendMe to display.
							</span>
						</div>
						<Input
							className="w-full max-w-md bg-gray-50"
							disabled
							value="English"
						/>
					</div>
					<div className="flex flex-col gap-4">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							Time format
						</p>
						<RadioGroup
							value={preferences.timeFormat}
							onValueChange={handleTimeFormat}
						>
							<div className="flex w-full items-center space-x-2 rounded-lg bg-[#F0F5FA] px-5 py-2.5">
								<RadioGroupItem value="12h" id={option12Id} />
								<Label
									htmlFor={option12Id}
									className="w-full font-normal text-[#4B4E58] text-sm"
								>
									12-hour clock
								</Label>
							</div>
							<div className="flex w-full items-center space-x-2.5 rounded-lg bg-[#F0F5FA] px-5 py-2.5">
								<RadioGroupItem value="24h" id={option24Id} />
								<Label
									htmlFor={option24Id}
									className="w-full font-normal text-[#4B4E58] text-sm"
								>
									24-hour clock
								</Label>
							</div>
						</RadioGroup>
					</div>
				</div>
			</div>
		</div>
	);
}
