"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  accentClass,
  fitness,
  type Accent,
  type FitnessItem,
  type FitnessTrack,
} from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

// Written out in full so Tailwind sees the class names.
const hoverBorder: Record<Accent, string> = {
  lime: "hover:border-lime",
  orange: "hover:border-orange",
  pink: "hover:border-pink",
  blue: "hover:border-blue",
};

const MotionLink = motion.create(Link);

// The items sweep in from the left, one after another, whenever a lane opens.
const listVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
  gone: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -80 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
  gone: { opacity: 0, x: -40, transition: { duration: 0.25, ease } },
};

function ItemCard({ item, accent }: { item: FitnessItem; accent: string }) {
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
          {item.name}
        </h4>
        <span className="font-mono text-[10px] tracking-widest whitespace-nowrap text-ink/45 uppercase">
          {item.meta}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.blurb}</p>
      {item.href && (
        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
          Open
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </span>
      )}
    </>
  );

  const shell = `group relative flex h-full flex-col rounded-md border border-ink/15 bg-ink/5 p-6 transition-colors ${accent}`;

  return item.href ? (
    <MotionLink href={item.href} variants={itemVariants} data-cursor="Open" className={shell}>
      {body}
    </MotionLink>
  ) : (
    <motion.div variants={itemVariants} className={shell}>
      {body}
    </motion.div>
  );
}

function TrackPanel({ track }: { track: FitnessTrack }) {
  return (
    <motion.div
      key={track.id}
      initial="hidden"
      animate="shown"
      exit="gone"
      variants={listVariants}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <motion.p
          variants={itemVariants}
          className="max-w-lg font-heading text-xl leading-snug font-semibold tracking-tight text-ink md:text-2xl"
        >
          {track.tagline}
        </motion.p>

        {track.href && (
          <MotionLink
            href={track.href}
            variants={itemVariants}
            data-cursor="Enter"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-[11px] tracking-widest text-paper uppercase transition-colors hover:bg-orange hover:text-ink"
          >
            {track.cta ?? "Open"}
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </MotionLink>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {track.items.map((item) => (
          <ItemCard key={item.id} item={item} accent={hoverBorder[track.accent]} />
        ))}
      </div>
    </motion.div>
  );
}

export function FitnessBoard() {
  const [activeId, setActiveId] = useState(fitness.tracks[0].id);
  const active = fitness.tracks.find((track) => track.id === activeId) ?? fitness.tracks[0];

  return (
    <section
      id="train"
      className="scroll-mt-24 rounded-t-[2rem] bg-paper px-4 py-16 text-ink md:rounded-t-[3rem] md:px-8 md:py-24"
    >
      <div className="flex flex-col justify-between gap-4 border-t border-ink/15 pt-4 font-mono text-[11px] tracking-widest uppercase md:flex-row">
        <span>({fitness.boardLabel})</span>
        <span className="text-ink/45">{fitness.boardHint}</span>
      </div>

      <h2 className="mt-8 font-display text-[13vw] leading-[0.9] uppercase md:mt-12 md:text-[7vw]">
        {fitness.boardTitle}
      </h2>

      {/* Lane selector */}
      <div
        role="tablist"
        aria-label={fitness.boardTitle}
        className="mt-10 flex flex-wrap gap-3 md:mt-14"
      >
        {fitness.tracks.map((track) => {
          const isActive = track.id === active.id;
          const accent = accentClass[track.accent];

          return (
            <button
              key={track.id}
              type="button"
              role="tab"
              id={`lane-${track.id}`}
              aria-selected={isActive}
              aria-controls={`lane-panel-${track.id}`}
              onClick={() => setActiveId(track.id)}
              data-cursor={track.label}
              className={`relative overflow-hidden rounded-full border border-ink/20 px-7 py-3.5 font-display text-2xl uppercase transition-colors md:text-3xl ${
                isActive ? `${accent.bg} border-transparent text-ink` : "hover:bg-ink/5"
              }`}
            >
              {track.label}
              <span className="ml-3 font-mono text-[10px] tracking-widest align-middle text-ink/45">
                {String(track.items.length).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`lane-panel-${active.id}`}
        aria-labelledby={`lane-${active.id}`}
        className="mt-10 md:mt-14"
      >
        <AnimatePresence mode="wait">
          <TrackPanel key={active.id} track={active} />
        </AnimatePresence>
      </div>
    </section>
  );
}
