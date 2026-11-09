"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { INTRO_DELAY } from "@/components/preloader";
import { menuLinks, site, socials } from "@/lib/content";

const ease = [0.76, 0, 0.24, 1] as const;

const MotionLink = motion.create(Link);

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

type SiteHeaderProps = {
  // Section links scroll in place on the home page and navigate to it from
  // anywhere else.
  onHome?: boolean;
  // The home page waits for the preloader; other pages bring the header in
  // right away.
  delay?: number;
};

export function SiteHeader({
  onHome = true,
  delay = onHome ? INTRO_DELAY + 0.4 : 0.1,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goTo = (href: string) => {
    setOpen(false);
    // Wait for the menu to start closing so scrolling is re-enabled.
    setTimeout(() => lenis?.scrollTo(href, { duration: 1.4 }), 350);
  };

  const isSection = (href: string) => href.startsWith("#");
  const hrefFor = (href: string) => (isSection(href) && !onHome ? `/${href}` : href);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-80 flex items-center justify-between px-4 py-4 mix-blend-difference md:px-8 md:py-6"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.8, ease }}
      >
        <Link
          href={hrefFor("#top")}
          onClick={(e) => {
            if (!onHome) return;
            e.preventDefault();
            goTo("#top");
          }}
          className="font-heading text-lg font-semibold tracking-tighter text-paper uppercase md:text-xl"
        >
          ZR
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden w-1/2 justify-between pr-12 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={hrefFor(link.href)}
              onClick={(e) => {
                if (!isSection(link.href) || !onHome) return;
                e.preventDefault();
                goTo(link.href);
              }}
              className="group relative font-heading text-base font-semibold tracking-tight text-paper"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          className="group relative flex size-12 flex-col items-center justify-center gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-0.5 w-7 origin-center bg-paper"
              animate={
                open
                  ? i === 0
                    ? { rotate: 45, y: 8 }
                    : i === 1
                      ? { opacity: 0, scaleX: 0 }
                      : { rotate: -45, y: -8 }
                  : { rotate: 0, y: 0, opacity: 1, scaleX: i === 1 ? 0.6 : 1 }
              }
              transition={{ duration: 0.4, ease }}
            />
          ))}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-menu"
            aria-label="Site"
            data-lenis-prevent
            className="fixed inset-0 z-70 overflow-y-auto bg-paper text-ink"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 3rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="flex min-h-full flex-col justify-between gap-10 px-4 pt-24 pb-8 md:px-8">
              <ul className="flex flex-col">
                {menuLinks.map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-ink/15">
                    <MotionLink
                      href={hrefFor(link.href)}
                      onClick={(e: React.MouseEvent) => {
                        if (!isSection(link.href) || !onHome) {
                          setOpen(false);
                          return;
                        }
                        e.preventDefault();
                        goTo(link.href);
                      }}
                      className="group flex items-baseline justify-between py-1 md:py-2"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }}
                    >
                      <span className="font-display text-[11vw] leading-none uppercase transition-[letter-spacing,color] duration-500 group-hover:tracking-wide group-hover:text-orange md:text-[6.5vw]">
                        {link.label}
                      </span>
                      <span className="font-mono text-xs text-ink/50">
                        0{i + 1}
                      </span>
                    </MotionLink>
                  </li>
                ))}
              </ul>

              <motion.div
                className="flex flex-col gap-6 font-mono text-xs tracking-widest uppercase md:flex-row md:items-end md:justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <a href={`mailto:${site.email}`} className="hover:text-orange">
                  {site.email}
                </a>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-orange">
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
