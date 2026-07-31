"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading kicker={t("kicker")} title={t("title")} subtitle={t("description")} />

            <Reveal delay={0.15}>
              <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t("directTitle")}
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-3 flex items-center gap-3 text-base font-semibold text-foreground hover:text-accent"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  {profile.email}
                </a>
                <div className="mt-5 flex gap-2">
                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
                  >
                    <FaGithub className="h-4 w-4" />
                  </a>
                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
                  >
                    <FaLinkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-8"
            >
              <input type="hidden" name="_subject" value="New message from apuorgho.com" />
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  {tf("name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={tf("namePlaceholder")}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {tf("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={tf("emailPlaceholder")}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  {tf("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={tf("messagePlaceholder")}
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
              >
                {status === "sending" ? (
                  tf("sending")
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {tf("send")}
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {tf("success")}
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {tf("error")}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
