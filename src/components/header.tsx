import AuthDialog from './auth/auth-dialog';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from './ui/navigation-menu';

function scrollToId(id: string) {
	const el = document.getElementById(id);
	if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
	return (
		<header className="z-50 flex w-full rounded-2xl bg-white px-8 py-[13px] shadow-xl">
			<nav className="flex w-full items-center justify-between">
				<div className="flex items-center gap-2.5">
					<img src="/logo.svg" alt="logo" className="h-8 w-8" />
					<h1 className="text-[16px] font-semibold text-primary">ComprehendMe</h1>
				</div>
				<div className="flex items-center">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink
									className="cursor-pointer"
									onClick={() => scrollToId('benefits')}
								>
									Benefits
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className="cursor-pointer"
									onClick={() => scrollToId('pricing')}
								>
									Pricing
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className="cursor-pointer"
									onClick={() => scrollToId('mission')}
								>
									Our mission
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
