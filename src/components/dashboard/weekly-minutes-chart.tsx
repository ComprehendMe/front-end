import { useTranslation } from "react-i18next";
import { useState, useRef, useCallback } from "react";
import type { WeeklyMinutesDay } from "@/lib/api";

type WeeklyMinutesChartProps = {
  data: WeeklyMinutesDay[];
};

export function WeeklyMinutesChart({ data }: WeeklyMinutesChartProps) {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<{
    value: number;
    x: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 25);
  const dynamicMax = Math.max(Math.ceil(maxMinutes / 5) * 5, 5);
  const ticks = Array.from(
    { length: dynamicMax / 5 + 1 },
    (_, i) => i * 5,
  );

  const vbWidth = 400;
  const vbHeight = 180;
  const padL = 38;
  const padR = 10;
  const padT = 8;
  const padB = 28;
  const chartW = vbWidth - padL - padR;
  const chartH = vbHeight - padT - padB;
  const numBars = data.length;
  const sectionW = chartW / numBars;
  const barW = Math.min(sectionW * 0.45, 24);

  const yScale = (minutes: number) =>
    padT + chartH - (minutes / dynamicMax) * chartH;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, minutes: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip({
        value: minutes,
        x: e.clientX - rect.left,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="rounded-[16px] bg-[var(--dashboard-soft)] p-3.5">
      <div ref={containerRef} className="relative h-[180px] w-full">
        <svg
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
          {ticks.map((tick) => {
            if (tick === 0) return null;
            const y = yScale(tick);
            return (
              <line
                key={tick}
                x1={padL}
                y1={y}
                x2={vbWidth - padR}
                y2={y}
                stroke="#E8EEF4"
                strokeWidth={1}
              />
            );
          })}

          {ticks.map((tick) => {
            const y = yScale(tick);
            return (
              <text
                key={tick}
                x={padL - 6}
                y={y + 4}
                textAnchor="end"
                fill="#64748B"
                fontSize={11}
              >
                {tick}
              </text>
            );
          })}

          {data.map((d, i) => {
            const x = padL + i * sectionW + (sectionW - barW) / 2;
            const barH = (d.minutes / dynamicMax) * chartH;
            const y = padT + chartH - barH;
            return (
              <g key={d.day}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(barH, 0)}
                  rx={5}
                  ry={5}
                  fill={d.isToday ? "#0978AA" : "#A8D4EC"}
                />
                <rect
                  x={padL + i * sectionW}
                  y={padT}
                  width={sectionW}
                  height={chartH}
                  fill="transparent"
                  onMouseEnter={(e) => handleMouseEnter(e, d.minutes)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: "pointer" }}
                />
              </g>
            );
          })}

          {data.map((d, i) => {
            const x = padL + i * sectionW + sectionW / 2;
            return (
              <text
                key={d.day}
                x={x}
                y={vbHeight - padB + 16}
                textAnchor="middle"
                fill="#64748B"
                fontSize={12}
              >
                {d.day}
              </text>
            );
          })}
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
            style={{ left: tooltip.x, top: 8 }}
          >
            {t("components.weekly-minutes-chart.min_format", {
              value: String(tooltip.value),
            })}
          </div>
        )}
      </div>
    </div>
  );
}
