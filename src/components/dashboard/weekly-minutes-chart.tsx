import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import type { WeeklyMinutesDay } from '@/lib/api';

const chartConfig = {
	minutes: {
		label: 'Minutes',
		color: '#1497D2',
	},
} satisfies ChartConfig;

type WeeklyMinutesChartProps = {
	data: WeeklyMinutesDay[];
};

export function WeeklyMinutesChart({ data }: WeeklyMinutesChartProps) {
	const max = Math.max(25, ...data.map((d) => d.minutes));

	return (
		<div className="rounded-xl bg-[#F0F5FA] p-4">
			<ChartContainer config={chartConfig} className="h-[180px] w-full">
				<BarChart
					accessibilityLayer
					data={data}
					barCategoryGap={12}
					margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
				>
					<CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#CBD5E1" />
					<XAxis
						dataKey="day"
						axisLine={false}
						tickLine={false}
						tickMargin={8}
						tick={{ fill: '#64748B', fontSize: 12 }}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tickMargin={4}
						domain={[0, max]}
						ticks={[5, 10, 15, 20, 25].filter((t) => t <= max)}
						tick={{ fill: '#94A3B8', fontSize: 11 }}
						width={28}
					/>
					<ChartTooltip
						cursor={{ fill: 'rgba(20, 151, 210, 0.08)' }}
						content={
							<ChartTooltipContent
								hideLabel
								formatter={(value) => [`${value} min`, '']}
							/>
						}
					/>
					<Bar dataKey="minutes" radius={[8, 8, 8, 8]} maxBarSize={36}>
						{data.map((entry) => (
							<Cell
								key={entry.day}
								fill={entry.isToday ? '#1497D2' : 'rgba(20, 151, 210, 0.25)'}
							/>
						))}
					</Bar>
				</BarChart>
			</ChartContainer>
		</div>
	);
}
