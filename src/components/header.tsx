import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";

export default function Header() {
	return (
		<header className="sticky px-8 py-[13px] top-4 rounded-2xl shadow-xl bg-white">
			<nav className="flex justify-between items-center">
				<div className="flex items-center gap-2.5">
					<img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
					<h1 className="text-[16px] font-semibold text-primary">CogniAI</h1>
				</div>
				<div className="flex items-center">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Benefícios</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Preços</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Nossa missão</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex items-center gap-2.5">
					<Button className="rounded-full px-6 bg-linear-to-bl from-[#18C6F1] to-[#0978AA]">
						Começar
					</Button>
				</div>
			</nav>
		</header>
	);
}
