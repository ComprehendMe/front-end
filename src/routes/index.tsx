import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/header";
import { PricingSection } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[32px_32px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[linear-gradient(to_bottom,transparent_0%,black)] dark:bg-black" />
        <div className="relative z-20 px-20 py-10">
          <Header />
          <main className="flex flex-col justify-center items-center text-center mt-44 z-50">
            <div className="flex flex-col gap-5 items-center">
              <h1 className="text-[40px] font-bold text-[#1C1F22]">
                Practice without fear. Serve without hesitation.
              </h1>
              <p className="text-lg text-[#1C1F22] font-medium tracking-tight max-w-4xl">
                Realistic virtual patients, immediate feedback, and a safe
                environment for you to grow as a therapist.
              </p>
              <Button size="lg" className="rounded-full text-lg px-6 w-fit">
                To start
              </Button>
            </div>
          </main>
          <section className="grid grid-cols-3 m-auto gap-[30px] mt-40">
            <div className="p-5 rounded-xl space-y-5 bg-white z-50 border border-[#E5E5E5] shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
              <div className="bg-linear-to-tr from-[#073E84] from-10% via-[#0978AA] via-90% to-[#1C97C8] rounded-lg w-fit p-4 flex items-center justify-center">
                <img
                  src="/Group.svg"
                  alt="Grupo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium">Choose a patient</p>
                <p className="text-[16px] text-[#757575] font-normal">
                  Clinical profiles with varying levels of difficulty and
                  behaviors.
                </p>
              </div>
            </div>
            <div className="p-5 rounded-xl space-y-5 bg-white z-50 border border-[#E5E5E5] shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
              <div className="bg-linear-to-tr from-[#073E84] from-10% via-[#0978AA] via-90% to-[#1C97C8] rounded-lg w-fit p-4 flex items-center justify-center">
                <img
                  src="/Vector.svg"
                  alt="Vetor"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium">Chat in real time</p>
                <p className="text-[16px] text-[#757575] font-normal">
                  Consistent and contextual AI, with emotional cues and natural
                  pacing.
                </p>
              </div>
            </div>
            <div className="p-5 rounded-xl space-y-5 bg-white z-50 border border-[#E5E5E5] shadow-[0px_8px_28.1px_0px_rgba(0,0,0,0.06)]">
              <div className="bg-linear-to-tr from-[#073E84] from-10% via-[#0978AA] via-90% to-[#1C97C8] rounded-lg w-fit p-4 flex items-center justify-center">
                <img
                  src="/carbon_report.svg"
                  alt="Relatório"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium">Receive a report</p>
                <p className="text-[16px] text-[#757575] font-normal">
                  Analyses of empathy, coherence, and key moments, with
                  recommendations.
                </p>
              </div>
            </div>
          </section>
          <PricingSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
