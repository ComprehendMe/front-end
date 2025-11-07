import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/header";
import { PricingSection } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="px-20 py-10">
			<div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(128,128,128,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.15)_1px,transparent_1px)] bg-size-[24px_24px]" />
			<Header />
			<main className="flex flex-col justify-center items-center text-center mt-44">
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
						className="rounded-full text-lg px-6 w-fit bg-linear-to-bl from-[#18C6F1] to-[#0978AA]"
					>
						Começar
					</Button>
				</div>
			</main>
			<section className="grid grid-cols-3 m-auto gap-[30px] mt-40">
				<div className="p-5 border rounded-xl space-y-5">
					<div className="bg-blue-600 rounded-lg w-fit p-4 flex items-center justify-center">
						<img
							src="/Group.svg"
							alt="Grupo"
							className="w-7 h-7 object-contain"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-medium">Escolha um paciente</h2>
						<p className="text-[16px] text-[#757575] font-normal">
							Perfis clínicos com níveis de dificuldade e comportamentos
							distintos.
						</p>
					</div>
				</div>
				<div className="p-5 border rounded-xl space-y-5">
					<div className="bg-blue-600 rounded-lg w-fit p-4 flex items-center justify-center">
						<img
							src="/Vector.svg"
							alt="Vetor"
							className="w-7 h-7 object-contain"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-medium">Converse em tempo real</h2>
						<p className="text-[16px] text-[#757575] font-normal">
							IA consistente e contextual, com sinais emocionais e ritmo
							natural.
						</p>
					</div>
				</div>
				<div className="p-5 border rounded-xl space-y-5">
					<div className="bg-blue-600 rounded-lg w-fit p-4 flex items-center justify-center">
						<img
							src="/carbon_report.svg"
							alt="Relatório"
							className="w-7 h-7 object-contain"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<h2 className="text-lg font-medium">Receba um relatório</h2>
						<p className="text-[16px] text-[#757575] font-normal">
							Análises de empatia, coerência e momentos‑chave, com
							recomendações.
						</p>
					</div>
				</div>
			</section>
			<PricingSection />
		</div>
	);
}
