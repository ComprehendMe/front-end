import { useEffect, useState } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "../ui/carousel";
import {
	ArrowLeftIcon,
	ArrowRight,
	ArrowRightIcon,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export function ContinueSection() {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!carouselApi) {
			return;
		}

		const updateSelection = () => {
			setCanScrollPrev(carouselApi.canScrollPrev());
			setCanScrollNext(carouselApi.canScrollNext());
		};
		updateSelection();
		carouselApi.on("select", updateSelection);

		return () => {
			carouselApi.off("select", updateSelection);
		};
	}, [carouselApi]);

	return (
		<div className="space-y-4">
			<div className="flex justify-between w-full items-center">
				<h2 className="text-black text-xl font-semibold">
					Continue Continue conversation
				</h2>
				<div className="flex gap-3">
					<Button
						className="rounded-full bg-white text-blue-500"
						size="icon-lg"
						disabled={!canScrollPrev}
						onClick={() => carouselApi?.scrollPrev()}
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<Button
						size="icon-lg"
						className="rounded-full"
						disabled={!canScrollNext}
						onClick={() => carouselApi?.scrollNext()}
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>
			</div>
			<div className="w-full bg-white rounded-xl p-5">
				<Carousel
					setApi={setCarouselApi}
					opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
					className="relative"
				>
					<CarouselContent>
						<CarouselItem className="md:max-w-[266px]">
							<Link
								to="/"
								className="group flex flex-col justify-between gap-4"
							>
								<div className="bg-blue-100 py-4 flex justify-center rounded-xl">
									<Avatar className="size-24">
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</div>
								<Badge variant="problems">Problems at School/Work</Badge>
								<div className="flex gap-2 flex-col">
									<p className="font-semibold text-xl text-black">
										Figma ipsum component variant main layer
									</p>
									<span className="text-gray-400 font-semibold text-sm">
										Rafaela Silva
									</span>
								</div>
							</Link>
						</CarouselItem>
						<CarouselItem className="md:max-w-[266px]">
							<Link
								to="/"
								className="group flex flex-col justify-between gap-4"
							>
								<div className="bg-blue-100 py-4 flex justify-center rounded-xl">
									<Avatar className="size-24">
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</div>
								<Badge>Problems at School/Work</Badge>
								<div className="flex gap-2 flex-col">
									<p className="font-semibold text-xl text-black">
										Figma ipsum component variant main layer
									</p>
									<span className="text-gray-400 font-semibold text-sm">
										Rafaela Silva
									</span>
								</div>
							</Link>
						</CarouselItem>
						<CarouselItem className="md:max-w-[266px]">
							<Link
								to="/"
								className="group flex flex-col justify-between gap-4"
							>
								<div className="bg-blue-100 py-4 flex justify-center rounded-xl">
									<Avatar className="size-24">
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</div>
								<Badge>Problems at School/Work</Badge>
								<div className="flex flex-col gap-2">
									<p className="font-semibold text-xl text-black">
										Figma ipsum component variant main layer
									</p>
									<span className="text-gray-400 font-semibold text-sm">
										Rafaela Silva
									</span>
								</div>
							</Link>
						</CarouselItem>
					</CarouselContent>
				</Carousel>
			</div>
		</div>
	);
}
