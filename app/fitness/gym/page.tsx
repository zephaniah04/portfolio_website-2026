import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ContactFooter } from "@/components/contact-footer";
import { MaskText, Reveal } from "@/components/reveal";
import { accentClass, gym, site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Gym plan — ${site.name}`,
  description: gym.intro,
};

export default function GymPage() {
  return (
    <>
      <SiteHeader onHome={false} />

      <main className="pt-28 md:pt-36">
        <header className="px-4 md:px-8">
          <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] tracking-widest text-mute uppercase">
            <span>({gym.label}) Fitness</span>
            <Link href="/fitness" className="transition-colors hover:text-lime">
              ← All training
            </Link>
          </div>

          <h1 className="mt-10 font-display text-[16vw] leading-[0.85] uppercase md:mt-16 md:text-[11vw]">
            <MaskText>{gym.title[0]}</MaskText>
            <MaskText delay={0.1}>
              <span className="text-outline">{gym.title[1]}</span>
            </MaskText>
          </h1>

          <Reveal className="mt-8 max-w-xl text-sm leading-relaxed text-paper/70 md:text-base">
            {gym.intro}
          </Reveal>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4">
            {gym.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="border-t border-line pt-4">
                <dt className="font-mono text-[10px] tracking-widest text-mute uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-4xl text-lime md:text-6xl">{stat.value}</dd>
              </Reveal>
            ))}
          </dl>

          {/* Jump links, matching the lane items on /fitness */}
          <nav aria-label="Training blocks" className="mt-14 flex flex-wrap gap-3 md:mt-20">
            {gym.blocks.map((block) => (
              <a
                key={block.id}
                href={`#${block.id}`}
                data-cursor="Jump"
                className={`rounded-full border px-5 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors hover:bg-paper/5 ${
                  accentClass[block.accent].border
                } ${accentClass[block.accent].text}`}
              >
                {block.name}
              </a>
            ))}
          </nav>
        </header>

        <div className="mt-16 rounded-t-[2rem] bg-paper px-4 py-16 text-ink md:mt-24 md:rounded-t-[3rem] md:px-8 md:py-24">
          <div className="border-t border-ink/15 pt-4 font-mono text-[11px] tracking-widest uppercase">
            ({gym.blocksLabel})
          </div>

          {gym.blocks.map((block) => (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-28 border-b border-ink/15 py-12 last:border-b-0 md:py-16"
            >
              <div className="grid gap-8 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-5">
                  <Reveal>
                    <span className="font-mono text-[11px] tracking-widest text-ink/45 uppercase">
                      {block.meta}
                    </span>
                    <h2 className="mt-3 font-display text-[11vw] leading-[0.9] uppercase md:text-[4.5vw]">
                      {block.name}
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
                      {block.goal}
                    </p>
                  </Reveal>
                </div>

                <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
                  <ul className="flex flex-col">
                    {block.work.map((entry) => (
                      <li
                        key={entry.move}
                        className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-4"
                      >
                        <span className="font-heading text-lg font-semibold tracking-tight md:text-xl">
                          {entry.move}
                        </span>
                        <span className="font-mono text-[11px] tracking-widest whitespace-nowrap text-ink/55 uppercase">
                          {entry.prescription}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </section>
          ))}
        </div>

        <section className="bg-paper px-4 pb-16 text-ink md:px-8 md:pb-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="border-t border-ink/15 pt-4 font-mono text-[11px] tracking-widest uppercase">
                ({gym.rulesLabel})
              </div>
              <ol className="mt-8 flex flex-col gap-5">
                {gym.rules.map((rule, i) => (
                  <Reveal key={rule} delay={i * 0.05} className="flex gap-5">
                    <span className="font-mono text-[11px] tracking-widest text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="max-w-xl font-heading text-lg leading-snug font-semibold tracking-tight md:text-xl">
                      {rule}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <div className="border-t border-ink/15 pt-4 font-mono text-[11px] tracking-widest uppercase">
                ({gym.prsLabel})
              </div>
              <dl className="mt-8 flex flex-col">
                {gym.prs.map((pr, i) => (
                  <Reveal
                    key={pr.lift}
                    delay={i * 0.05}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/15 py-4"
                  >
                    <dt className="font-mono text-[11px] tracking-widest text-ink/55 uppercase">
                      {pr.lift}
                    </dt>
                    <dd className="font-display text-2xl uppercase md:text-3xl">{pr.value}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="rounded-b-[2rem] bg-paper px-4 pb-20 text-ink md:rounded-b-[3rem] md:px-8 md:pb-28">
          <Link
            href="/fitness"
            data-cursor="Back"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-[11px] tracking-widest text-paper uppercase transition-colors hover:bg-orange hover:text-ink"
          >
            <span className="transition-transform duration-500 group-hover:-translate-x-1">←</span>
            Back to all training
          </Link>
        </section>
      </main>

      <ContactFooter />
    </>
  );
}
