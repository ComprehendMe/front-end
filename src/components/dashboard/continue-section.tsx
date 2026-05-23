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
	'group flex cursor-pointer flex-col rounded-xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40';

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
		<div className="space-y-4">
			<div className="flex w-full items-center justify-between">
				{title ? (
					<h2 className="text-xl font-semibold text-foreground">
						{title}
					</h2>
				) : (
					<div />
				)}
				<div className="flex gap-3">
					<Button
						variant="outline"
						className="rounded-full"
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
			<div className="w-full rounded-xl bg-white p-5 select-none">
				<Carousel
					setApi={setCarouselApi}
					opts={{
						dragFree: true,
						containScroll: 'trimSnaps',
					}}
					className="relative"
				>
					<CarouselContent>
						{chats.map((chat) => {
							const patientIndex = getPatientIndex(patients, chat.patientId);

							return (
								<CarouselItem key={chat.id} className="basis-full md:basis-1/2 lg:basis-1/3 md:max-w-[266px]">
									<Link
										to="/dashboard/chat/$chatId"
										params={{ chatId: chat.id }}
										className={cardLinkClass}
									>
										<div className="relative">
											{chat.pausedAt ? (
												<Badge
													variant="secondary"
													className="absolute top-2 right-2 z-10 bg-[#F8F8CD] text-[#726B07]"
												>
													Paused
												</Badge>
											) : null}
											<PatientCardContent
												patientIndex={patientIndex}
												patientId={chat.patientId}
												patientName={chat.patient.name}
												problem={chat.patient.problem}
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
