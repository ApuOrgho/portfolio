"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { awards } from "@/data/awards";

export function Awards() {
  const t = useTranslations("awards");

  return (
    <section id="awards" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading kicker={t("kicker")} title={t("title")} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, i) => (
            <Reveal key={award.id} delay={(i % 3) * 0.08}>
              <TiltCard>
              <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                  <Image
                    src={award.image}
                    alt={t(`items.${award.id}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                  <span className="absolute right-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
                    {award.year}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {t(`items.${award.id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">
                    {t(`items.${award.id}.description`)}
                  </p>
                </div>
              </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
