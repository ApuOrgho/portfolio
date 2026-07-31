"use client";

import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { profile } from "@/data/profile";

const socials = [
  { href: profile.social.github, icon: FaGithub, label: "GitHub" },
  { href: profile.social.linkedin, icon: FaLinkedin, label: "LinkedIn" },
  { href: profile.social.twitter, icon: FaXTwitter, label: "Twitter / X" },
  { href: profile.social.facebook, icon: FaFacebookF, label: "Facebook" },
  { href: profile.social.instagram, icon: FaInstagram, label: "Instagram" },
];

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold text-foreground">
            {profile.name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">{t("tagline")}</p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-3 border-t border-border px-6 py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.name}. {t("rights")}
        </p>
        <a
          href="#top"
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {t("backToTop")}
          <ArrowUp className="h-3 w-3" />
        </a>
      </div>
    </footer>
  );
}
