import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Patient } from "@/lib/api";
import { PatientCardContent } from "./patient-card";

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
  const { t } = useTranslation();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("reInit", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("reInit", updateSelection);
    };
  }, [carouselApi]);

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-end">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            size="icon-lg"
            disabled={!canScrollPrev || loading}
            onClick={() => carouselApi?.scrollPrev()}
            aria-label={t('common.previous_patient_aria')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon-lg"
            className="rounded-full"
            disabled={!canScrollNext || loading}
            onClick={() => carouselApi?.scrollNext()}
            aria-label={t('common.next_patient_aria')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="w-full rounded-xl bg-white p-5 select-none">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : patients.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground text-sm">
            {t('dashboard.index.no_patients')}
          </p>
        ) : (
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
              containScroll: false,
            }}
            className="relative"
          >
            <CarouselContent>
              {patients.map((patient, index) => {
                const isStarting = startingId === patient.id;

                return (
                  <CarouselItem
                    key={patient.id}
                    className="basis-[calc(100%/1.5)] sm:basis-[calc(100%/2.5)] lg:basis-[calc(100%/3.5)] 4xl:basis-[calc(100%/4.5)]"
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
                            ? `${patient.name} · ${t('dashboard.index.starting')}`
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
