import { useId } from "react";

export default function MissionSection() {
	const sectionId = useId();
	return (
		<section
			id={sectionId}
			className="mx-auto flex w-full flex-col items-center px-4 pt-20 pb-10 text-center sm:pt-24 sm:pb-12"
		>
			<div className="flex flex-col items-center">
				<p className="text-[18px] font-bold leading-[1.4rem] text-[#1C1F22]">
					Our mission
				</p>
				<h2 className="mt-4 max-w-[920px] text-balance text-[28px] font-bold leading-8 text-[#1C1F22] sm:text-[32px] sm:leading-[1.4rem]">
					Helping future psychologists train with confidence
				</h2>
				<p className="mt-4 max-w-[820px] text-balance text-base font-normal leading-6 text-[#1C1F22] sm:text-[18px] sm:leading-[1.5rem]">
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
				className="mt-14 h-auto w-[488px] max-w-full object-contain sm:mt-24"
				loading="lazy"
			/>
		</section>
	);
}
