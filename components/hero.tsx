"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { InteractiveGrid } from "@/components/interactive-grid";
import { INTRO_DELAY } from "@/components/preloader";
import { site } from "@/lib/content";

const ease = [0.76, 0, 0.24, 1] as const;
const d = INTRO_DELAY;

const disciplines = ["Photography", "Videography", "Design", "Fitness"];

function SplitLetters({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-hidden className="inline-flex overflow-hidden pb-[0.08em]">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: delay + i * 0.03, duration: 0.9, ease }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// One line of the big statement, slid up from behind a mask.
function Line({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1.1, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} fill="currentColor">
      {[0, 45, 90, 135].map((r) => (
        <rect key={r} x="44" y="0" width="12" height="100" transform={`rotate(${r} 50 50)`} />
      ))}
    </svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden bg-ink"
    >
      <h1 className="sr-only">
        {site.name} — {site.role}
      </h1>

      {/* Background photo */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.25, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: d - 0.3, duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={site.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/40 to-ink/30" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/60" />
      <motion.div
        className="hero-grid absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d + 0.4, duration: 1.5 }}
      >
        <InteractiveGrid />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-10 flex flex-1 flex-col justify-between px-4 pt-24 pb-24 md:px-8 md:pt-28 md:pb-20"
      >
        {/* Top row: name block + discipline list */}
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <motion.div
              className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-widest text-paper/80 uppercase"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: d + 0.3, duration: 0.6 }}
            >
              <span className="flex">
                <span className="size-3 rounded-full bg-coral" />
                <span className="-ml-1 size-3 rounded-full border-2 border-coral" />
              </span>
              Portfolio ©2026
            </motion.div>

            <p className="font-heading text-[12vw] leading-none font-semibold tracking-[-0.04em] text-paper md:text-[5.2vw]">
              <SplitLetters text={site.name} delay={d + 0.1} />
            </p>

            <motion.ul
              className="mt-5 font-heading text-xs leading-snug font-semibold tracking-wide text-paper/90 uppercase md:text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d + 0.7, duration: 0.8, ease }}
            >
              <li>
                <PinIcon className="mr-1 inline-block size-3 align-[-0.15em] text-coral" />
                Kolkata, 22 Yrs Old
              </li>
              <li>Based in {site.location}</li>
            </motion.ul>
          </div>

          <div>
            <motion.span
              className="mb-2 flex items-center gap-2 font-mono text-[11px] tracking-widest text-paper/70 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: d + 0.5, duration: 0.6 }}
            >
              <span className="text-coral">+</span> Z.R—26
            </motion.span>
            <div className="relative pl-4">
              <motion.span
                className="absolute top-0 left-0 h-full w-px origin-top bg-coral"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: d + 0.5, duration: 1, ease }}
              />
              <ul
                data-cursor-plain
                className="font-heading text-2xl leading-[1.15] md:text-[2.4vw] font-semibold tracking-[-0.03em] text-paper"
              >
                {disciplines.map((item, i) => (
                  <li key={item} className="overflow-hidden">
                    <motion.a
                      href={i < 3 ? "#services" : "#fitness"}
                      className="inline-block transition-colors duration-300 hover:text-coral"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: d + 0.6 + i * 0.08, duration: 0.8, ease }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Big statement */}
        <div className="mt-10 flex items-end justify-between gap-6 md:mt-12">
          <p
            aria-hidden
            className="font-heading text-[10.5vw] leading-[0.88] font-bold tracking-[-0.055em] uppercase md:text-[8vw]"
          >
            <Line delay={d + 0.35} className="flex items-start gap-[0.15em] text-coral">
              Creative
              <motion.span
                className="inline-block w-[0.55em] pt-[0.05em]"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: d + 1, duration: 1, ease }}
              >
                <motion.span
                  className="block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <Asterisk className="w-full" />
                </motion.span>
              </motion.span>
            </Line>
            <Line delay={d + 0.45} className="text-paper">
              Photographer <span className="text-coral">&amp;</span>
            </Line>
            <Line delay={d + 0.55} className="text-paper">
              Filmmaker
            </Line>
          </p>

          {/* Vertical credit + barcode */}
          <motion.div
            className="hidden flex-col items-center gap-3 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: d + 1.2, duration: 0.8 }}
          >
            <span className="rotate-180 font-mono text-[10px] tracking-widest whitespace-nowrap text-paper/70 uppercase [writing-mode:vertical-rl]">
              {site.name} · All work, all rights.
            </span>
            <span className="flex h-8 w-6 items-stretch gap-0.5" aria-hidden>
              {[2, 1, 3, 1, 2, 1, 1, 3].map((w, i) => (
                <span key={i} className="bg-paper/70" style={{ width: w }} />
              ))}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Book-a-shoot chip, bottom right */}
      <motion.a
        href="#contact"
        className="absolute right-4 bottom-6 z-20 hidden items-center gap-3 rounded-lg border border-paper/15 bg-ink/70 p-2 pr-4 backdrop-blur-md transition-colors hover:border-coral md:right-20 md:bottom-8 md:flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d + 1.3, duration: 0.8, ease }}
      >
        <span className="relative size-10 overflow-hidden rounded-md">
          <Image src={site.photo} alt="" fill sizes="40px" className="object-cover" />
        </span>
        <span className="flex flex-col">
          <span className="font-heading text-sm font-semibold tracking-tight text-paper">
            Book a shoot
          </span>
          <span className="font-mono text-[10px] tracking-widest text-paper/60 uppercase">
            Available now
          </span>
        </span>
      </motion.a>
    </section>
  );
}
