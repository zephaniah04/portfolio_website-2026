"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Reveal, SectionLabel } from "@/components/reveal";
import { site, stats } from "@/lib/content";

// Words wrapped in *asterisks* are highlighted in an accent colour, in order.
const paragraph =
  "I'm Zephaniah, a *creative photographer* and *amateur videographer* who believes every frame should feel like something. Off camera, I *design* posters and visual identities, and most mornings start in the gym. *Fitness* keeps me disciplined. Design keeps me curious.";
const highlightColors = ["text-lime", "text-orange", "text-pink", "text-blue"];
// Fraction of the tracked scroll by which the last word is fully lit, so the
// paragraph finishes around the middle of the section rather than at its end.
const LIT_BY = 0.7;

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${className ?? ""}`}>
      {children}
    </motion.span>
  );
}

function ScrollParagraph() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.65"] });

  // Split into words while tracking which highlighted phrase each word belongs to.
  const words: { text: string; highlight: number | null }[] = [];
  let highlight = -1;
  paragraph.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const isHighlight = chunk.startsWith("*");
    if (isHighlight) highlight++;
    chunk
      .replaceAll("*", "")
      .split(" ")
      .filter(Boolean)
      .forEach((text) => words.push({ text, highlight: isHighlight ? highlight : null }));
  });

  return (
    <p
      ref={ref}
      className="flex flex-wrap font-display text-[8.5vw] leading-[1.05] uppercase md:text-[4.6vw]"
    >
      {words.map((word, i) => {
        const step = LIT_BY / words.length;
        const start = i * step;
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, start + step]}
            className={word.highlight !== null ? highlightColors[word.highlight % 4] : undefined}
          >
            {word.text}
          </Word>
        );
      })}
    </p>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      <span className="text-lime">{suffix}</span>
    </span>
  );
}

export function About() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="about" className="relative px-4 py-24 md:px-8 md:py-40">
      <SectionLabel index="03" label="About me" />

      <ScrollParagraph />

      <div className="mt-20 grid gap-10 md:mt-32 md:grid-cols-12 md:gap-8">
        <div
          ref={imageRef}
          className="relative aspect-4/5 overflow-hidden rounded-sm md:col-span-5"
          data-cursor="Hi!"
        >
          <motion.div style={{ y: imageY }} className="absolute -inset-y-[15%] inset-x-0">
            <Image
              src={site.photo}
              alt={`${site.name} at work`}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="flex flex-col justify-between gap-12 md:col-span-6 md:col-start-7">
          <Reveal className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-sm border border-line p-6">
              <span className="font-mono text-[10px] tracking-widest text-pink uppercase">
                Also — Design
              </span>
              <p className="mt-3 text-sm leading-relaxed text-paper/75">
                Posters, social graphics and small brand identities. Design sharpens
                how I compose every photograph.
              </p>
            </div>
            <div className="rounded-sm border border-line p-6">
              <span className="font-mono text-[10px] tracking-widest text-blue uppercase">
                Also — Fitness
              </span>
              <p className="mt-3 text-sm leading-relaxed text-paper/75">
                Strength training and early mornings. The discipline in the gym
                shows up on every shoot.
              </p>
            </div>
          </Reveal>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-10">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="border-t border-line pt-4">
                <dt className="font-mono text-[10px] tracking-widest text-mute uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-6xl md:text-7xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
