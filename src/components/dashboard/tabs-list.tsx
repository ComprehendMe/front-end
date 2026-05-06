import {
	useLocation,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";

interface ListProps {
	tabs: {
		title: string;
		items: {
			name: string;
			icon?: React.ReactElement;
			value: string;
		}[];
	};
	url: string;
	searchParamName?: string;
	disabled?: boolean;
}

export function ListTab({ tabs, url, searchParamName, disabled }: ListProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const search = useSearch({
		strict: false,
		select: (search) => search as Record<string, string | undefined>,
	});

	const ref = useRef<HTMLDivElement | null>(null);

	function handleChange(value: string) {
		if (!searchParamName) {
			navigate({
				to: `${url}/${value}`,
				search: location.search,
			});
			return;
		}

		navigate({
			to: url,
			search: (prev) => ({
				...prev,
				[searchParamName]: value || undefined,
			}),
			replace: Boolean(search),
		});
	}

	const [, after] = location.pathname.split("/settings");
	const defaultValue = searchParamName ? search[searchParamName] : after || "/";

	return (
		<div className="space-y-4">
			<p className="text-sm font-semibold text-gray-400">{tabs.title}</p>
			<div className="w-full max-w-md">
				<Tabs
					className="flex-row"
					defaultValue={defaultValue}
					onValueChange={handleChange}
				>
					<TabsList ref={ref} className="bg-background h-full flex-col w-full">
						{tabs.items.map((tab) => (
							<TabsTrigger
								className="w-full justify-start"
								key={tab.value}
								value={tab.value}
								disabled={disabled}
							>
								{tab.icon}
								{tab.name}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>
		</div>
	);
}
