"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ExternalLink, PlayCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Projects() {
  const t = useTranslations("projects");
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading kicker={t("kicker")} title={t("title")} />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <TiltCard className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                  <Image
                    src={project.image}
                    alt={t(`items.${project.id}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {t("featured")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {t(`items.${project.id}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {t(`items.${project.id}.description`)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                      >
                        <FaGithub className="h-4 w-4" />
                        {t("repo")}
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t("demo")}
                      </a>
                    )}
                  </div>
                </div>
              </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <TiltCard className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
                  <Image
                    src={project.image}
                    alt={t(`items.${project.id}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {t(`items.${project.id}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {t(`items.${project.id}.description`)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.video && (
                    <a
                      href={project.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                    >
                      <PlayCircle className="h-4 w-4" />
                      {t("watchDemo")}
                    </a>
                  )}
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
