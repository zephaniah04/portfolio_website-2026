import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ContactFooter } from "@/components/contact-footer";
import { FitnessBoard } from "@/components/fitness-board";
import { VelocityMarquee } from "@/components/velocity-marquee";
import { MaskText, Reveal } from "@/components/reveal";
import { fitness, site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Fitness — ${site.name}`,
  description: fitness.intro,
};

export default function FitnessPage() {
  return (
    <>
      <SiteHeader onHome={false} />

      <main className="pt-28 md:pt-36">
        {/* Dark hero, so the page still reads as part of the portfolio */}
        <header className="px-4 md:px-8">
          <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] tracking-widest text-mute uppercase">
            <span>({fitness.label}) Training</span>
            <Link href="/" className="transition-colors hover:text-lime">
              ← Back home
            </Link>
          </div>

          <h1 className="mt-10 font-display text-[17vw] leading-[0.82] uppercase md:mt-16 md:text-[12vw]">
            <MaskText>{fitness.title[0]}</MaskText>
            <MaskText delay={0.1}>
              <span className="text-outline">{fitness.title[1]}</span>
            </MaskText>
          </h1>

          <Reveal className="mt-8 max-w-xl text-sm leading-relaxed text-paper/70 md:text-base">
            {fitness.intro}
          </Reveal>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4">
            {fitness.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="border-t border-line pt-4">
                <dt className="font-mono text-[10px] tracking-widest text-mute uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-4xl text-lime md:text-6xl">{stat.value}</dd>
              </Reveal>
            ))}
          </dl>
        </header>

        <VelocityMarquee
          items={fitness.marquee}
          baseVelocity={-3}
          className="mt-16 border-y border-line py-5 font-display text-[13vw] leading-none uppercase md:mt-24 md:text-[7vw]"
        />

        {/* The bright board: gym, sports and recovery lanes */}
        <FitnessBoard />

        {/* What I follow */}
        <section className="bg-paper px-4 pb-16 text-ink md:px-8 md:pb-24">
          <div className="border-t border-ink/15 pt-4 font-mono text-[11px] tracking-widest uppercase">
            ({fitness.principlesLabel})
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-md bg-ink/15 md:mt-14 md:grid-cols-2">
            {fitness.principles.map((principle, i) => (
              <Reveal
                key={principle.number}
                delay={i * 0.06}
                className="h-full bg-paper p-7 md:p-10"
              >
                <span className="font-mono text-[11px] tracking-widest text-ink/40">
                  {principle.number}
                </span>
                <h3 className="mt-4 font-display text-3xl leading-none uppercase md:text-4xl">
                  {principle.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">{principle.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* A normal week */}
        <section className="rounded-b-[2rem] bg-paper px-4 pb-20 text-ink md:rounded-b-[3rem] md:px-8 md:pb-32">
          <div className="border-t border-ink/15 pt-4 font-mono text-[11px] tracking-widest uppercase">
            ({fitness.weekLabel})
          </div>

          <ul className="mt-6 flex flex-col">
            {fitness.week.map((day, i) => (
              <li key={day.day} className="border-b border-ink/15">
                <Reveal
                  delay={i * 0.04}
                  className="grid items-baseline gap-2 py-5 md:grid-cols-12 md:gap-8"
                >
                  <span className="font-mono text-[11px] tracking-widest text-ink/40 uppercase md:col-span-1">
                    {day.day}
                  </span>
                  <span className="font-display text-2xl uppercase md:col-span-4 md:text-3xl">
                    {day.focus}
                  </span>
                  <span className="text-sm leading-relaxed text-ink/65 md:col-span-7">
                    {day.detail}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <ContactFooter />
    </>
  );
}
