"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const mounted = useMounted();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onScrollOrResize() {
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const MENU_WIDTH = 144;
  const VIEWPORT_MARGIN = 8;

  function toggleOpen() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const fitsRightOfButtonLeft = rect.left + MENU_WIDTH + VIEWPORT_MARGIN <= window.innerWidth;
      const left = fitsRightOfButtonLeft
        ? rect.left
        : Math.max(VIEWPORT_MARGIN, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN);
      setPosition({ top: rect.bottom + 8, left });
    }
    setOpen((v) => !v);
  }

  function switchTo(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t("label")}
        onClick={toggleOpen}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
      {open &&
        position &&
        mounted &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="z-[100] w-36 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-xl shadow-black/10"
          >
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchTo(l)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-muted",
                  l === locale ? "text-accent font-semibold" : "text-foreground"
                )}
              >
                {localeLabels[l]}
                <span className="text-xs uppercase text-muted">{l}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
