import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function DashboardHeader() {
	return (
		<header className="flex items-center gap-8 w-full">
			<Input
				className="h-12 rounded-full bg-white border-[#1C1F22]/15 px-8 py-4 w-full"
				placeholder="Search patients..."
			/>
			<div className="flex gap-5 items-center max-w-3xs w-full">
				<Button
					size="icon-lg"
					className="rounded-full border-[#1C1F22]/15 text-gray-500"
					variant="outline"
				>
					<Bell size={22} />
				</Button>
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<span className="text-gray-500 font-medium text-[16px]">
						Joana Almeida
					</span>
				</div>
			</div>
		</header>
	);
}
