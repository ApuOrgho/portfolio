"use client";

import { useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { contests } from "@/data/contests";
import { formatContestDate } from "@/lib/utils";

const WIDTH = 920;
const HEIGHT = 320;
const PAD_X = 28;
const PAD_TOP = 28;
const PAD_BOTTOM = 40;

export function RankChart() {
  const t = useTranslations("competitive");
  const locale = useLocale();
  const gradientId = useId();
  const [hovered, setHovered] = useState<number | null>(null);

  const { points, maxRank, bestIndex, ticks } = useMemo(() => {
    const maxRank = Math.max(...contests.map((c) => c.rank));
    const plotW = WIDTH - PAD_X * 2;
    const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const n = contests.length;

    const pts = contests.map((c, i) => {
      const x = PAD_X + (n === 1 ? 0 : (i / (n - 1)) * plotW);
      const y = PAD_TOP + ((c.rank - 1) / (maxRank - 1)) * plotH;
      return { x, y, contest: c };
    });

    let bestIndex = 0;
    contests.forEach((c, i) => {
      if (c.rank < contests[bestIndex].rank) bestIndex = i;
    });

    const niceMax = Math.ceil(maxRank / 50) * 50;
    const step = niceMax / 4;
    const ticks = [1, step, step * 2, step * 3, niceMax];

    return { points: pts, maxRank, bestIndex, ticks };
  }, []);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${HEIGHT - PAD_BOTTOM} L ${points[0].x.toFixed(2)} ${HEIGHT - PAD_BOTTOM} Z`;

  function yForRank(rank: number) {
    const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
    return PAD_TOP + ((rank - 1) / (maxRank - 1)) * plotH;
  }

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - relX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setHovered(nearest);
  }

  const active = hovered !== null ? points[hovered] : points[bestIndex];
  const activeIsBest = hovered === null || hovered === bestIndex;

  return (
    <div className="relative rounded-3xl border border-border bg-surface p-5 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-foreground">
          {t("chartTitle")}
        </h3>
        <p className="text-xs text-muted">
          {contests[0].contest.length > 0 &&
            `${formatContestDate(contests[0].date, locale)} — ${formatContestDate(
              contests[contests.length - 1].date,
              locale
            )}`}
        </p>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none"
          onPointerMove={handleMove}
          onPointerLeave={() => setHovered(null)}
          role="img"
          aria-label={t("chartTitle")}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD_X}
                x2={WIDTH - PAD_X}
                y1={yForRank(tick)}
                y2={yForRank(tick)}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text
                x={PAD_X}
                y={yForRank(tick) - 6}
                fontSize="11"
                fill="var(--color-muted)"
              >
                #{Math.round(tick)}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => {
            const isBest = i === bestIndex;
            const isHovered = hovered === i;
            return (
              <g key={p.contest.serial}>
                {(isBest || isHovered) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 5}
                    fill="var(--color-surface)"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                  />
                )}
                {isHovered && (
                  <line
                    x1={p.x}
                    x2={p.x}
                    y1={PAD_TOP}
                    y2={HEIGHT - PAD_BOTTOM}
                    stroke="var(--color-accent)"
                    strokeWidth={1}
                    strokeDasharray="3 4"
                    opacity={0.5}
                  />
                )}
              </g>
            );
          })}

          {(() => {
            const p = points[bestIndex];
            return (
              <text
                x={p.x}
                y={p.y - 14}
                fontSize="11"
                fontWeight={700}
                textAnchor="middle"
                fill="var(--color-foreground)"
              >
                {t("statBest")} #{p.contest.rank}
              </text>
            );
          })()}
        </svg>

        <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">{active.contest.contest}</p>
          <p className="mt-0.5 text-xs text-muted">
            {active.contest.team} · {formatContestDate(active.contest.date, locale)} ·{" "}
            <span className={activeIsBest ? "text-accent font-semibold" : ""}>
              {t("columns.rank")} #{active.contest.rank}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
