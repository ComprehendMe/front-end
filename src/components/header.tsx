import { Link } from "@tanstack/react-router";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";
import AuthDialog from "./auth/auth-dialog";

export default function Header() {
	return (
		<header className="flex w-full px-8 py-[13px] rounded-2xl shadow-xl bg-white z-50">
			<nav className="flex justify-between items-center w-full">
				<div className="flex items-center gap-2.5">
					<img src="/logo.svg" alt="logo" className="w-8 h-8" />
					<h1 className="text-[16px] font-semibold text-primary">ComprehendMe</h1>
				</div>
				<div className="flex items-center">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Benefits</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Pricing</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link to="/">Our mission</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex items-center gap-2.5">
					<AuthDialog />
				</div>
			</nav>
		</header>
	);
}
