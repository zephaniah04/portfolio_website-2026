"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { MaskText, Reveal, SectionLabel } from "@/components/reveal";
import { accentClass, journal, type JournalEntry } from "@/lib/content";

function TiltCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.25), transparent 50%)`,
  );
  const accent = accentClass[entry.accent];

  return (
    <Reveal delay={index * 0.1} className="[perspective:1000px]">
      <motion.article
        id={entry.id}
        data-cursor="Read"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - rect.left) / rect.width);
          my.set((e.clientY - rect.top) / rect.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative scroll-mt-24 overflow-hidden rounded-md border border-line bg-ink-soft"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={entry.image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
          <span
            className={`absolute top-4 left-4 rounded-full px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase ${accent.bg}`}
          >
            {entry.label}
          </span>
        </div>
        <div className="flex flex-col gap-3 p-6" style={{ transform: "translateZ(40px)" }}>
          <h3 className="font-display text-3xl uppercase md:text-4xl">{entry.title}</h3>
          <p className="text-sm leading-relaxed text-paper/70">{entry.excerpt}</p>
          {entry.href ? (
            <Link
              href={entry.href}
              className={`mt-2 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase ${accent.text}`}
            >
              {entry.cta ?? "Read more"}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ) : (
            <span
              className={`mt-2 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase ${accent.text}`}
            >
              Posts coming soon
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          )}
        </div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
      </motion.article>
    </Reveal>
  );
}

export function Journal() {
  return (
    <section id="journal" className="relative px-4 py-24 md:px-8 md:py-40">
      <SectionLabel index="04" label="Journal" />

      <div className="mb-12 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
        <h2 className="font-display text-[13vw] leading-[0.9] uppercase md:text-[8vw]">
          <MaskText>Beyond</MaskText>
          <MaskText delay={0.1}>
            the <span className="text-orange">lens</span>
          </MaskText>
        </h2>
        <Reveal className="max-w-sm text-sm leading-relaxed text-paper/70">
          Money, stories and training. Everything that keeps the creative life
          running when the camera is off.
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {journal.map((entry, i) => (
          <TiltCard key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
