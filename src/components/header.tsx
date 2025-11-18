import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import StartHere from "./start-here";

export default function Header() {
  return (
    <header className="flex w-full px-8 py-[13px] rounded-2xl shadow-xl bg-white z-50">
      <nav className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
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
          <StartHere />
        </div>
      </nav>
    </header>
  );
}
