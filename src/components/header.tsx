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
		<header className="sticky px-[32px] py-[13px] top-0 rounded-2xl shadow-xl bg-white">
			<nav className="flex justify-between items-center border">
				<div className="flex items-center gap-[10px]">
					<img src="/logo.svg" alt="logo" />
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
				<div className="flex items-center gap-[10px]">
					<Button className="rounded-full px-[24px] bg-linear-to-bl from-[#18C6F1] to-[#0978AA]">Começar</Button>
				</div>
			</nav>
		</header>
	);
}
