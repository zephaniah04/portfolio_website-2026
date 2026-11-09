import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ContactFooter } from "@/components/contact-footer";
import { MaskText, Reveal } from "@/components/reveal";
import { accentClass, accentForTopic, blog, site } from "@/lib/content";
import { formatPostDate, getBlogPosts, groupByTopic, type BlogPost } from "@/lib/notion";

export const metadata: Metadata = {
  title: `Blog — ${site.name}`,
  description: blog.intro,
};

function TopicChip({ topic, count }: { topic: string; count: number }) {
  const accent = accentClass[accentForTopic(topic)];

  return (
    <a
      href={`#topic-${topic.toLowerCase()}`}
      data-cursor="Jump"
      className={`group flex items-center gap-3 rounded-full border px-5 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors ${accent.border} ${accent.text} hover:bg-paper/5`}
    >
      {topic}
      <span className="text-mute">{String(count).padStart(2, "0")}</span>
    </a>
  );
}

function PostRow({ post, index }: { post: BlogPost; index: number }) {
  const accent = accentClass[accentForTopic(post.topic)];

  return (
    <Reveal delay={index * 0.05}>
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="Read"
        className="group grid items-center gap-4 border-b border-line py-7 md:grid-cols-12 md:gap-8"
      >
        {post.cover ? (
          <div className="relative aspect-3/2 overflow-hidden rounded-md md:col-span-2">
            <Image
              src={post.cover}
              alt=""
              fill
              sizes="(min-width: 768px) 16vw, 100vw"
              className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          </div>
        ) : (
          <span className="font-mono text-[11px] tracking-widest text-mute uppercase md:col-span-2">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <h3 className="font-heading text-2xl font-semibold tracking-tight transition-colors group-hover:text-lime md:col-span-5 md:text-3xl">
          {post.title}
        </h3>

        <p className="text-sm leading-relaxed text-paper/60 md:col-span-3">{post.summary}</p>

        <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-widest uppercase md:col-span-2">
          <span className={accent.text}>{formatPostDate(post.date)}</span>
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </Reveal>
  );
}

async function BlogIndex() {
  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return (
      <Reveal className="border-t border-line px-4 py-24 md:px-8">
        <h2 className="font-display text-4xl uppercase md:text-6xl">{blog.empty.title}</h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/60">{blog.empty.body}</p>
      </Reveal>
    );
  }

  const topics = groupByTopic(posts);

  return (
    <>
      <div className="border-t border-line px-4 py-10 md:px-8">
        <p className="mb-5 font-mono text-[11px] tracking-widest text-mute uppercase">
          {blog.topicsLabel} ({String(topics.length).padStart(2, "0")})
        </p>
        <div className="flex flex-wrap gap-3">
          {topics.map((group) => (
            <TopicChip key={group.topic} topic={group.topic} count={group.posts.length} />
          ))}
        </div>
      </div>

      {topics.map((group) => (
        <section
          key={group.topic}
          id={`topic-${group.topic.toLowerCase()}`}
          className="scroll-mt-28 border-t border-line px-4 py-16 md:px-8 md:py-24"
        >
          <h2 className="mb-8 font-display text-[12vw] leading-none uppercase md:mb-12 md:text-[7vw]">
            <MaskText>
              <span className={accentClass[accentForTopic(group.topic)].text}>{group.topic}</span>
            </MaskText>
          </h2>

          <div className="flex flex-col">
            {group.posts.map((post, i) => (
              <PostRow key={post.id} post={post} index={i} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function IndexSkeleton() {
  return (
    <div className="border-t border-line px-4 py-24 md:px-8">
      <p className="font-mono text-[11px] tracking-widest text-mute uppercase">Loading posts…</p>
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <SiteHeader onHome={false} />
      <main className="pt-28 md:pt-36">
        <header className="px-4 md:px-8">
          <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] tracking-widest text-mute uppercase">
            <span>({blog.label}) Written in Notion</span>
            <Link href="/" className="transition-colors hover:text-lime">
              ← Back home
            </Link>
          </div>

          <h1 className="mt-10 font-display text-[16vw] leading-[0.85] uppercase md:mt-16 md:text-[11vw]">
            <MaskText>{blog.title[0]}</MaskText>
            <MaskText delay={0.1}>
              <span className="text-outline">{blog.title[1]}</span>
            </MaskText>
          </h1>

          <Reveal className="mt-8 mb-16 max-w-xl text-sm leading-relaxed text-paper/70 md:mb-24 md:text-base">
            {blog.intro}
          </Reveal>
        </header>

        <Suspense fallback={<IndexSkeleton />}>
          <BlogIndex />
        </Suspense>
      </main>
      <ContactFooter />
    </>
  );
}
