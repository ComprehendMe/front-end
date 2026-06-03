import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '../ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Chat } from '@/lib/api';
import { getPatientAvatar } from '@/lib/patient-avatar';

type ContinueSectionProps = {
	chats: Chat[];
	title?: string;
};

export function ContinueSection({ chats, title }: ContinueSectionProps) {
	const { t } = useTranslation();
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!carouselApi) return;

		const updateSelection = () => {
			setCanScrollPrev(carouselApi.canScrollPrev());
			setCanScrollNext(carouselApi.canScrollNext());
		};
		updateSelection();
		carouselApi.on('select', updateSelection);
		carouselApi.on('reInit', updateSelection);

		return () => {
			carouselApi.off('select', updateSelection);
			carouselApi.off('reInit', updateSelection);
		};
	}, [carouselApi]);

	if (chats.length === 0) return null;

	return (
		<section className="space-y-3">
			<div className="flex w-full items-center justify-between px-0.5">
				{title ? (
					<h2 className="text-2xl font-semibold leading-[1.1] text-[#1C1F22]">
						{title}
					</h2>
				) : (
					<div />
				)}
				<div className="flex gap-3">
					<Button
						variant="outline"
						className="rounded-full border-[#DDDDDE]/80 bg-white shadow-xs hover:bg-gray-50"
						size="icon-lg"
						disabled={!canScrollPrev}
						onClick={() => carouselApi?.scrollPrev()}
					>
						<ChevronLeft className="h-5 w-5 text-[#1497D2]" />
					</Button>
					<Button
						size="icon-lg"
						className="rounded-full bg-[#1497D2] shadow-xs hover:bg-[#2285B3]"
						disabled={!canScrollNext}
						onClick={() => carouselApi?.scrollNext()}
					>
						<ChevronRight className="h-5 w-5 text-white" />
					</Button>
				</div>
			</div>
			<div className="w-full select-none">
				<Carousel
					setApi={setCarouselApi}
					opts={{
						dragFree: true,
						containScroll: false,
						align: 'start',
					}}
					className="relative"
				>
					<CarouselContent className="-ml-4">
						{chats.map((chat) => (
							<CarouselItem key={chat.id} className="pl-4 basis-[calc(100%/2.5)]">
								<Link
									to="/dashboard/chat/$chatId"
									params={{ chatId: chat.id }}
									className="flex items-center gap-3 rounded-[18px] border border-[#E8EDF2] bg-white p-4 shadow-xs outline-none transition hover:shadow-sm hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-primary/40"
								>
									<div className="relative shrink-0">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={getPatientAvatar(chat.patient.name)}
												alt=""
											/>
											<AvatarFallback>
												{chat.patient.name[0]}
											</AvatarFallback>
										</Avatar>
										{chat.pausedAt && (
											<div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F8F8CD] text-[8px] font-bold text-[#726B07] border border-white" title={t('components.continue-section.paused_indicator')}>
												P
											</div>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-semibold text-[#1C1F22]">
											{chat.patient.name}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{chat.patient.problem}
										</p>
									</div>
									<ChevronRight className="h-5 w-5 shrink-0 text-[#1497D2]" />
								</Link>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	);
}
