import { Link } from "@tanstack/react-router";
import {
	BsDiscord,
	BsInstagram,
	BsLinkedin,
	BsTwitterX,
	BsYoutube,
} from "react-icons/bs";

export default function Footer() {
	return (
		<footer className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-20 lg:py-16">
			<div className="flex flex-col gap-6">
				<div className="flex gap-2 items-center">
					<img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
					<span className="font-semibold text-[16px] text-primary">
						ComprehendMe
					</span>
				</div>
				<p className="text-foreground font-normal text-[16px]">
					© 2025 ComprehendMe. All rights reserved.
				</p>
				<div className="flex gap-3 items-center">
					<a href="https://github.com" target="_blank" rel="noopener">
						<BsDiscord className="w-4 h-4 text-foreground object-contain" />
					</a>
					<a href="https://x.com" target="_blank" rel="noopener">
						<BsTwitterX className="w-4 h-4 text-foreground object-contain" />
					</a>
					<a href="https://youtube.com" target="_blank" rel="noopener">
						<BsYoutube className="w-4 h-4 text-foreground object-contain" />
					</a>
					<a href="https://instagram.com" target="_blank" rel="noopener">
						<BsInstagram className="w-4 h-4 text-foreground object-contain" />
					</a>
					<a href="https://linkedin.com" target="_blank" rel="noopener">
						<BsLinkedin className="w-4 h-4 text-foreground object-contain" />
					</a>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-[54px]">
				<ul className="flex flex-col gap-3">
					<li className="text-foreground font-normal text-[16px]">
						<Link to="/">Benefits</Link>
					</li>
					<li className="text-foreground font-normal text-[16px]">
						<Link to="/">Pricing</Link>
					</li>
					<li className="text-foreground font-normal text-[16px]">
						<Link to="/">Our mission</Link>
					</li>
				</ul>
				<ul className="flex flex-col gap-3">
					<li className="text-foreground font-normal text-[16px]">
						<Link to="/">Privacy Policy</Link>
					</li>
					<li className="text-foreground font-normal text-[16px]">
						<Link to="/">Terms of use</Link>
					</li>
					<li className="text-foreground font-normal text-[16px]">
						<Link to="/">Cookies policy</Link>
					</li>
				</ul>
			</div>
		</footer>
	);
}
