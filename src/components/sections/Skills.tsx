"use client";

import { useTranslations } from "next-intl";
import { Code2, LayoutPanelTop, Server, Wrench, Trophy, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { skillCategories } from "@/data/skills";

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  layout: LayoutPanelTop,
  server: Server,
  wrench: Wrench,
  trophy: Trophy,
};

export function Skills() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => {
            const Icon = ICONS[category.icon] ?? Code2;
            return (
              <Reveal key={category.id} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                    {t(`categories.${category.id}`)}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
