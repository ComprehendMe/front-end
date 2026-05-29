import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '../ui/carousel';
import { Badge } from '@/components/ui/badge';
import type { Chat, Patient } from '@/lib/api';
import { getPatientIndex } from '@/lib/patient-assets';
import { PatientCardContent } from './patient-card';

const cardLinkClass =
	'group flex cursor-pointer flex-col rounded-[22px] outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/40';

type ContinueSectionProps = {
	chats: Chat[];
	patients: Patient[];
	title?: string;
};

export function ContinueSection({ chats, patients, title }: ContinueSectionProps) {
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
		<div className="space-y-3">
			<div className="flex w-full items-center justify-between px-0.5">
				{title ? (
					<h2 className="text-fluid-3xl font-semibold leading-[1.1] text-[#1C1F22]">
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
						{chats.map((chat) => {
							const patientIndex = getPatientIndex(patients, chat.patientId);

							return (
								<CarouselItem key={chat.id} className="pl-4 basis-[calc(100%/2.5)]">
									<Link
										to="/dashboard/chat/$chatId"
										params={{ chatId: chat.id }}
										className={cardLinkClass}
									>
										<div className="relative h-full">
											{chat.pausedAt ? (
												<Badge
													variant="secondary"
													className="absolute top-4 right-4 z-10 bg-[#F8F8CD] text-[#726B07] border-none"
												>
													Paused
												</Badge>
											) : null}
											<PatientCardContent
												patientIndex={patientIndex}
												patientId={chat.patientId}
												patientName={chat.patient.name}
												problem={chat.patient.problem}
												className="h-full rounded-[22px] border border-[#E6EBEF] bg-white p-5 shadow-xs"
											/>
										</div>
									</Link>
								</CarouselItem>
							);
						})}
					</CarouselContent>
				</Carousel>
			</div>
		</div>
	);
}
