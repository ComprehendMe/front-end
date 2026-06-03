import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import type { WeeklyMinutesDay } from "@/lib/api";

type WeeklyMinutesChartProps = {
  data: WeeklyMinutesDay[];
};

export function WeeklyMinutesChart({ data }: WeeklyMinutesChartProps) {
  const { t } = useTranslation();
  const maxMinutes = Math.max(...data.map((d) => d.minutes), 25);
  const dynamicMax = Math.ceil(maxMinutes / 5) * 5;
  const dynamicTicks = Array.from(
    { length: dynamicMax / 5 + 1 },
    (_, i) => i * 5
  );

  const chartConfig = {
    minutes: {
      label: t('components.weekly-minutes-chart.label'),
      color: "#1497D2",
    },
  };

  return (
    <div className="rounded-[16px] bg-[var(--dashboard-soft)] p-3.5">
      <ChartContainer config={chartConfig} className="h-[180px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          barCategoryGap="30%"
          margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#E8EEF4" strokeWidth={1} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tickMargin={7}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, dynamicMax]}
            ticks={dynamicTicks}
            tick={{ fill: "#64748B", fontSize: 11 }}
            width={28}
          />
          <ChartTooltip
            cursor={{ fill: "rgba(20, 151, 210, 0.08)" }}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value) => [t('components.weekly-minutes-chart.min_format', { value: String(value) }), ""]}
              />
            }
          />
          <Bar dataKey="minutes" radius={[5, 5, 5, 5]} maxBarSize={20}>
            {data.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.isToday ? "#0978AA" : "#A8D4EC"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
