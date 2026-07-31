import { defineRouting } from "next-intl/routing";

export const locales = ["en", "bn", "no"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
  no: "Norsk",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
