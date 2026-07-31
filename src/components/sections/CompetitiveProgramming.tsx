"use client";

import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, Trophy, Users, Swords } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { profile } from "@/data/profile";
import { contests, contestStats } from "@/data/contests";
import { formatContestDate } from "@/lib/utils";
import { RankChart } from "./RankChart";

const STATS = [
  { key: "statContests", icon: Swords, num: contestStats.total, prefix: "", suffix: "+" },
  { key: "statBest", icon: Trophy, num: contestStats.bestRank, prefix: "#", suffix: "" },
  { key: "statTeams", icon: Users, num: contestStats.teams, prefix: "", suffix: "" },
] as const;

export function CompetitiveProgramming() {
  const t = useTranslations("competitive");
  const locale = useLocale();
  const chronological = [...contests].reverse();

  return (
    <section id="competitive" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />
          <Reveal delay={0.1}>
            <a
              href={profile.cpStandingsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
            >
              {t("viewFull")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STATS.map(({ key, icon: Icon, num, prefix, suffix }, i) => (
            <Reveal key={key} delay={i * 0.06}>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    <AnimatedCounter value={num} prefix={prefix} suffix={suffix} />
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {t(key)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="mt-6">
          <div className="flex flex-wrap gap-3">
            {profile.cpProfiles.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {p.label}
                <span className="text-muted">@{p.handle}</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mt-10">
          <RankChart />
        </Reveal>

        <Reveal delay={0.22} className="mt-10">
          <div className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
            <h3 className="font-display text-lg font-bold text-foreground">
              {t("tableTitle")}
            </h3>
            <div className="mt-5 max-h-[26rem] overflow-y-auto rounded-2xl border border-border">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="sticky top-0 bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3">{t("columns.serial")}</th>
                    <th className="px-4 py-3">{t("columns.team")}</th>
                    <th className="px-4 py-3">{t("columns.contest")}</th>
                    <th className="px-4 py-3">{t("columns.date")}</th>
                    <th className="px-4 py-3 text-right">{t("columns.rank")}</th>
                  </tr>
                </thead>
                <tbody>
                  {chronological.map((c) => (
                    <tr
                      key={c.serial}
                      className="border-t border-border odd:bg-background even:bg-surface"
                    >
                      <td className="px-4 py-3 text-muted">{c.serial}</td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {c.team}
                      </td>
                      <td className="px-4 py-3 text-muted">{c.contest}</td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">
                        {formatContestDate(c.date, locale)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {c.rank === contestStats.bestRank ? (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">
                            #{c.rank}
                          </span>
                        ) : (
                          `#${c.rank}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
