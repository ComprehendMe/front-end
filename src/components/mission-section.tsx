export default function MissionSection() {
	return (
		<section
			id="mission"
			className="mx-auto flex w-full flex-col items-center px-4 pt-24 pb-12 text-center"
		>
			<div className="flex flex-col items-center">
				<p className="text-[18px] font-bold leading-[1.4rem] text-[#1C1F22]">
					Our mission
				</p>
				<h2 className="mt-4 max-w-[920px] text-balance text-[32px] font-bold leading-[1.4rem] text-[#1C1F22]">
					Helping future psychologists train with confidence
				</h2>
				<p className="mt-4 max-w-[820px] text-balance text-[18px] font-normal leading-[1.5rem] text-[#1C1F22]">
					We build safe, guided virtual patient experiences so psychology
					students can practise therapeutic conversations, strengthen clinical
					reasoning, and grow their confidence before real-world sessions.
				</p>
			</div>

			<img
				src="/lp.png"
				alt="Students collaborating around a virtual patient session"
				width={488}
				height={287}
				className="mt-24 h-auto w-[488px] max-w-full object-contain"
				loading="lazy"
			/>
		</section>
	);
}
