"use client";

import { useLocale, useTranslations } from "next-intl";
import { Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/data/experience";
import { formatPeriod } from "@/lib/utils";

export function Experience() {
  const t = useTranslations("experience");
  const locale = useLocale();

  return (
    <section id="experience" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading kicker={t("kicker")} title={t("title")} />

        <ol className="relative mt-14 space-y-10 border-l border-border pl-8 sm:pl-10">
          {experience.map((item, i) => {
            const points = t.raw(`items.${item.id}.points`) as string[];
            return (
              <Reveal key={item.id} delay={i * 0.08} as="div" className="relative">
                <span className="absolute -left-[2.55rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-accent sm:-left-[3.05rem]">
                  <Briefcase className="h-3.5 w-3.5" />
                </span>

                <div className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {t(`items.${item.id}.role`)}
                    </h3>
                    {item.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                        {t("present")}
                      </span>
                    )}
                  </div>

                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-medium text-accent hover:underline"
                    >
                      {item.org}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-muted">{item.org}</p>
                  )}

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {formatPeriod(item.start, item.end, locale, t("present"))}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {points.map((point, idx) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
