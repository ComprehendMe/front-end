export default function MissionSection() {
	return (
		<section
			id="mission"
			className="mx-auto flex w-full flex-col items-center px-fluid-container py-fluid-section text-center"
		>
			<div className="flex flex-col items-center">
				<p className="text-fluid-lg font-bold leading-[1.4rem] text-[#1C1F22]">
					Our mission
				</p>
				<h2 className="mt-4 max-w-[920px] text-balance text-fluid-3xl font-bold leading-8 text-[#1C1F22]">
					Helping future psychologists train with confidence
				</h2>
				<p className="mt-4 max-w-[820px] text-balance text-fluid-base font-normal leading-6 text-[#1C1F22]">
					We build safe, guided virtual patient experiences so psychology
					students can practise therapeutic conversations, strengthen clinical
					reasoning, and grow their confidence before real-world sessions.
				</p>
			</div>

			<img
				src="/lp.png"
				alt="Students collaborating around a virtual patient session"
				className="mt-[clamp(2rem,6vw,6rem)] h-auto w-full max-w-[clamp(280px,60vw,1000px)] object-contain"
				loading="lazy"
			/>
		</section>
	);
}
