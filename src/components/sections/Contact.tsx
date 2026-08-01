"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  RotateCw,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

type Step = "details" | "otp";
type Status = "idle" | "submitting" | "verifying" | "error" | "done";

const RESEND_COOLDOWN = 45;

export function Contact() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const locale = useLocale();

  const [step, setStep] = useState<Step>("details");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [token, setToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const honeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function requestOtp() {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, honey: honeyRef.current?.value ?? "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.error === "rate_limited") setErrorMsg(tf("otp.rateLimited"));
        else setErrorMsg(tf("otp.sendFailed"));
        setStatus("error");
        return;
      }

      setToken(data.token);
      setStep("otp");
      setStatus("idle");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setStatus("error");
      setErrorMsg(tf("otp.sendFailed"));
    }
  }

  function handleDetailsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    void requestOtp();
  }

  async function handleOtpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || status === "verifying") return;

    setStatus("verifying");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token, code, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.error === "invalid_code") setErrorMsg(tf("otp.invalidCode"));
        else if (data.error === "expired_or_invalid") setErrorMsg(tf("otp.expired"));
        else if (data.error === "rate_limited") setErrorMsg(tf("otp.rateLimited"));
        else setErrorMsg(tf("error"));
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMsg(tf("error"));
    }
  }

  function editDetails() {
    setStep("details");
    setStatus("idle");
    setErrorMsg(null);
    setCode("");
    setToken(null);
  }

  return (
    <section id="contact" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="min-w-0">
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

          <Reveal delay={0.1} className="min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {status === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <p className="mt-5 max-w-sm text-base font-medium text-foreground">
                      {tf("otp.verifiedNotice")}
                    </p>
                  </motion.div>
                ) : step === "details" ? (
                  <motion.form
                    key="details"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleDetailsSubmit}
                    className="space-y-5"
                  >
                    <input
                      ref={honeyRef}
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden
                    />

                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        {tf("name")}
                      </label>
                      <input
                        id="name"
                        required
                        minLength={2}
                        maxLength={120}
                        placeholder={tf("namePlaceholder")}
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        {tf("email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        maxLength={200}
                        placeholder={tf("emailPlaceholder")}
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        {tf("message")}
                      </label>
                      <textarea
                        id="message"
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={5}
                        placeholder={tf("messagePlaceholder")}
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
                    >
                      {status === "submitting" ? (
                        tf("sending")
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {tf("send")}
                        </>
                      )}
                    </button>

                    {status === "error" && errorMsg && (
                      <p className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        {errorMsg}
                      </p>
                    )}
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleOtpSubmit}
                    className="space-y-5"
                  >
                    <div className="flex items-start gap-3 rounded-2xl bg-accent-soft p-4">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{tf("otp.title")}</p>
                        <p className="mt-1 text-sm text-muted">
                          {tf("otp.description", { email: form.email })}
                        </p>
                      </div>
                    </div>

                    <div>
                      <input
                        id="otp-code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        required
                        maxLength={6}
                        placeholder={tf("otp.placeholder")}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="h-14 w-full rounded-xl border border-border bg-background px-4 text-center text-2xl font-bold tracking-[0.5em] text-foreground outline-none transition-colors placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-muted focus:border-accent"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={status === "verifying" || code.length !== 6}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:flex-none"
                      >
                        {status === "verifying" ? tf("otp.verifying") : tf("otp.verify")}
                      </button>

                      <button
                        type="button"
                        onClick={() => void requestOtp()}
                        disabled={cooldown > 0 || status === "submitting"}
                        className="inline-flex h-12 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        {cooldown > 0 ? tf("otp.resendIn", { seconds: cooldown }) : tf("otp.resend")}
                      </button>

                      <button
                        type="button"
                        onClick={editDetails}
                        className="inline-flex h-12 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-foreground"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        {tf("otp.edit")}
                      </button>
                    </div>

                    {status === "error" && errorMsg && (
                      <p className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        {errorMsg}
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
