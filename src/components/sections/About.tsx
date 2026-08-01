"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Mail, Heart, Download, Eye } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";
import { education } from "@/data/education";

export function About() {
  const t = useTranslations("about");
  const te = useTranslations("education");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section id="about" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading kicker={t("kicker")} title={t("title")} />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="order-2 min-w-0 lg:order-1">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent-soft to-secondary-soft blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] border border-border bg-surface">
                <Image
                  src="/images/profile.png"
                  alt={profile.name}
                  width={480}
                  height={560}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {t("locationLabel")}
                    </p>
                    <p className="text-sm text-foreground">{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {t("emailLabel")}
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-foreground hover:text-accent"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {t("interestsLabel")}
                    </p>
                    <p className="text-sm text-foreground">{t("interests")}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="space-y-5">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-balance text-base leading-relaxed text-muted sm:text-lg">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={profile.cvUrl}
                  download
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  {t("downloadCv")}
                </a>
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <Eye className="h-4 w-4" />
                  {t("viewCv")}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.36}>
              <div id="education" className="mt-12 scroll-mt-24">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {te("title")}
                </h3>
                <ul className="mt-5 space-y-4">
                  {education.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
                        <Image
                          src={item.image}
                          alt={item.school}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-sm font-semibold text-foreground hover:text-accent"
                        >
                          {item.school}
                        </a>
                        <p className="text-sm text-muted">
                          {te(`items.${item.id}.degree`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
