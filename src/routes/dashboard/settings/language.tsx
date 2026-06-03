import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import type { AppLanguage, TimeFormat } from "@/lib/user-preferences";
import i18n from "@/lib/i18n";
import { Route as DashboardRoute } from "../../dashboard";

export const Route = createFileRoute("/dashboard/settings/language")({
	component: LanguagePage,
});

function LanguagePage() {
	const id = useId();
	const { t } = useTranslation();
	const { user } = DashboardRoute.useRouteContext();
	const { preferences, updatePreferences } = useUserPreferences(user.email);
	const optionEnId = `${id}-en`;
	const optionPtId = `${id}-pt`;
	const option12Id = `${id}-12h`;
	const option24Id = `${id}-24h`;

	function handleLanguageChange(value: string) {
		const lang = value as AppLanguage;
		updatePreferences({ language: lang });
		i18n.changeLanguage(lang);
		document.documentElement.lang = lang;
		toast.success(t('dashboard.settings.language.toast_saved'));
	}

	function handleTimeFormat(value: string) {
		const timeFormat: TimeFormat = value === "24h" ? "24h" : "12h";
		updatePreferences({ timeFormat });
		toast.success(t('dashboard.settings.language.toast_saved'));
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.language.title')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-7 flex flex-col gap-10">
					<div className="flex flex-col gap-4">
						<div className="space-y-2">
							<p className="font-semibold text-[#4B4E58] text-[16px]">
								{t('dashboard.settings.language.language_label')}
							</p>
							<span className="font-regular text-gray-400 text-sm">
								{t('dashboard.settings.language.language_hint')}
							</span>
						</div>
						<RadioGroup
							value={preferences.language}
							onValueChange={handleLanguageChange}
						>
							<div className="flex w-full items-center space-x-2 rounded-lg bg-[#F0F5FA] px-5 py-2.5">
								<RadioGroupItem value="en" id={optionEnId} />
								<Label
									htmlFor={optionEnId}
									className="w-full font-normal text-[#4B4E58] text-sm"
								>
									{t('dashboard.settings.language.en')}
								</Label>
							</div>
							<div className="flex w-full items-center space-x-2.5 rounded-lg bg-[#F0F5FA] px-5 py-2.5">
								<RadioGroupItem value="pt-PT" id={optionPtId} />
								<Label
									htmlFor={optionPtId}
									className="w-full font-normal text-[#4B4E58] text-sm"
								>
									{t('dashboard.settings.language.pt-PT')}
								</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="flex flex-col gap-4">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							{t('dashboard.settings.language.time_format_label')}
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
									{t('dashboard.settings.language.time_format_12h')}
								</Label>
							</div>
							<div className="flex w-full items-center space-x-2.5 rounded-lg bg-[#F0F5FA] px-5 py-2.5">
								<RadioGroupItem value="24h" id={option24Id} />
								<Label
									htmlFor={option24Id}
									className="w-full font-normal text-[#4B4E58] text-sm"
								>
									{t('dashboard.settings.language.time_format_24h')}
								</Label>
							</div>
						</RadioGroup>
					</div>
				</div>
			</div>
		</div>
	);
}
