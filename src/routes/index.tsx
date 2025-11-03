import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="px-[80px] py-[40px]">
			<div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
			<Header />
			<main className="flex flex-col justify-center items-center text-center mt-28">
				<div className="flex flex-col gap-[20px] items-center">
					<h1 className="text-4xl font-bold">Pratica sem medo. Atende sem dúvidas.</h1>
					<p className="text-xl text-[#757575] font-medium tracking-tight max-w-4xl">
          Pacientes virtuais realistas, feedback imediato e ambiente seguro para evoluíres como terapeuta.
					</p>
          <Button size="lg" className="rounded-full text-lg px-[24px] w-fit bg-linear-to-bl from-[#18C6F1] to-[#0978AA]">Começar</Button>
				</div>
			</main>
		</div>
	);
}
