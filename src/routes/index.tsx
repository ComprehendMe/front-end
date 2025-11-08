import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/header";
import { PricingSection } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="relative min-h-screen bg-white">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          height: "490px",
          background:
            "linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundColor: "#fff",
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 z-10"
        aria-hidden="true"
        style={{
          top: 360,
          height: 80,
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)"
        }}
      />
      <div className="relative z-20 px-20 py-10">
        <Header />
        <main className="flex flex-col justify-center items-center text-center mt-44 z-50">
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-4xl font-bold">
              Pratica sem medo. Atende sem dúvidas.
            </h1>
            <p className="text-xl text-[#757575] font-medium tracking-tight max-w-4xl">
              Pacientes virtuais realistas, feedback imediato e ambiente seguro
              para evoluíres como terapeuta.
            </p>
            <Button
              size="lg"
              className="rounded-full text-lg px-6 w-fit bg-linear-to-bl from-[#18C6F1] via-[#1C97C8] via-60% to-[#0978AA]"
            >
              Começar
            </Button>
          </div>
        </main>
        <section className="grid grid-cols-3 m-auto gap-[30px] mt-40">
          <div className="p-5 rounded-xl space-y-5 bg-white z-50 border border-[#E5E5E5] shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
            <div className="bg-blue-600 rounded-lg w-fit p-4 flex items-center justify-center">
              <img
                src="/Group.svg"
                alt="Grupo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">Escolha um paciente</p>
              <p className="text-[16px] text-[#757575] font-normal">
                Perfis clínicos com níveis de dificuldade e comportamentos
                distintos.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-xl space-y-5 bg-white z-50 border border-[#E5E5E5] shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
            <div className="bg-blue-600 rounded-lg w-fit p-4 flex items-center justify-center">
              <img
                src="/Vector.svg"
                alt="Vetor"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">Converse em tempo real</p>
              <p className="text-[16px] text-[#757575] font-normal">
                IA consistente e contextual, com sinais emocionais e ritmo
                natural.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-xl space-y-5 bg-white z-50 border border-[#E5E5E5] shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
            <div className="bg-blue-600 rounded-lg w-fit p-4 flex items-center justify-center">
              <img
                src="/carbon_report.svg"
                alt="Relatório"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">Receba um relatório</p>
              <p className="text-[16px] text-[#757575] font-normal">
                Análises de empatia, coerência e momentos‑chave, com
                recomendações.
              </p>
            </div>
          </div>
        </section>
        <PricingSection />
      </div>
      <div
        className="pointer-events-none absolute left-0 right-0 z-0"
        aria-hidden="true"
        style={{
          top: "430px",
          bottom: 0,
          background: "#fff",
        }}
      />
    </div>
  );
}
