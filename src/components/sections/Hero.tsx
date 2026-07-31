"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles as SparklesIcon } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { RoleCycler } from "./RoleCycler";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function Hero() {
  const t = useTranslations("hero");
  const tRoot = useTranslations();
  const roles = t.raw("roles") as string[];
  const name = tRoot("personName");

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent-soft opacity-70 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-secondary-soft opacity-60 blur-3xl" />
        <div className="absolute inset-0 bg-noise" />
      </div>

      <div
        className="absolute inset-0 -z-[5] opacity-80 [mask-image:linear-gradient(to_right,transparent,black_38%)] sm:[mask-image:linear-gradient(to_right,transparent,black_32%)]"
      >
        <HeroScene />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-sm font-medium text-muted backdrop-blur"
          >
            <SparklesIcon className="h-3.5 w-3.5 text-accent" />
            {t("greeting")} {name}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl"
          >
            <RoleCycler roles={roles} />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 max-w-xl text-balance text-base text-muted sm:text-lg"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.4}>
              <a
                href="#projects"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.4}>
              <a
                href="#contact"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface/80 px-6 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
              >
                {t("ctaSecondary")}
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label={t("scroll")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted"
      >
        {t("scroll")}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
