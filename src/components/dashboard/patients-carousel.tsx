import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import type { Patient } from '@/lib/api';
import { PatientCardContent } from './patient-card';

type PatientsCarouselProps = {
	patients: Patient[];
	loading?: boolean;
	startingId: string | null;
	onSelectPatient: (patient: Patient) => void;
};

export function PatientsCarousel({
	patients,
	loading = false,
	startingId,
	onSelectPatient,
}: PatientsCarouselProps) {
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

	return (
		<div className="space-y-4">
			<div className="flex w-full items-center justify-between">
				<h2 className="text-xl font-semibold text-foreground">
					Escolhe um paciente
				</h2>
				<div className="flex gap-3">
					<Button
						variant="outline"
						className="rounded-full"
						size="icon-lg"
						disabled={!canScrollPrev || loading}
						onClick={() => carouselApi?.scrollPrev()}
						aria-label="Paciente anterior"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<Button
						size="icon-lg"
						className="rounded-full"
						disabled={!canScrollNext || loading}
						onClick={() => carouselApi?.scrollNext()}
						aria-label="Próximo paciente"
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="w-full rounded-xl bg-white p-5">
				{loading ? (
					<div className="flex justify-center py-16">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : patients.length === 0 ? (
					<p className="py-12 text-center text-muted-foreground text-sm">
						Nenhum paciente disponível.
					</p>
				) : (
					<Carousel
						setApi={setCarouselApi}
						opts={{
							align: 'start',
							loop: false,
							breakpoints: {
								'(max-width: 768px)': { dragFree: true },
							},
						}}
						className="relative"
					>
						<CarouselContent className="-ml-4">
							{patients.map((patient, index) => {
								const isStarting = startingId === patient.id;

								return (
									<CarouselItem
										key={patient.id}
										className="basis-full pl-4 md:basis-1/2 lg:basis-1/3 md:max-w-[266px]"
									>
										<button
											type="button"
											disabled={startingId !== null}
											onClick={() => onSelectPatient(patient)}
											className="group flex h-full w-full cursor-pointer flex-col rounded-xl text-left outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<PatientCardContent
												patientIndex={index}
												patientId={patient.id}
												patientName={patient.name}
												problem={patient.problem}
												subtitle={
													isStarting
														? `${patient.name} · A iniciar…`
														: patient.name
												}
											/>
										</button>
									</CarouselItem>
								);
							})}
						</CarouselContent>
					</Carousel>
				)}
			</div>
		</div>
	);
}
