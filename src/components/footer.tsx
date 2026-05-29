import {
	BsDiscord,
	BsInstagram,
	BsLinkedin,
	BsTwitterX,
	BsYoutube,
} from "react-icons/bs";

function scrollToId(id: string) {
	const el = document.getElementById(id);
	if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Footer() {
	return (
		<footer className="flex flex-col gap-fluid-xl px-fluid-container py-fluid-section lg:flex-row lg:justify-between">
			<div className="flex flex-col gap-6">
				<div className="flex gap-2 items-center">
					<img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
					<span className="font-semibold text-fluid-sm text-primary">
						ComprehendMe
					</span>
				</div>
				<p className="text-foreground font-normal text-fluid-sm">
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
		<div className="flex flex-col justify-center">
			<ul className="flex flex-col gap-3">
				<li>
					<button
						onClick={() => scrollToId('benefits')}
						className="text-foreground font-normal text-fluid-sm cursor-pointer hover:underline"
					>
						Benefits
					</button>
				</li>
				<li>
					<button
						onClick={() => scrollToId('pricing')}
						className="text-foreground font-normal text-fluid-sm cursor-pointer hover:underline"
					>
						Pricing
					</button>
				</li>
			</ul>
		</div>
		</footer>
	);
}
