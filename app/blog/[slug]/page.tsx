import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContactFooter } from "@/components/contact-footer";
import { NotionContent } from "@/components/notion-content";
import { MaskText, Reveal } from "@/components/reveal";
import { accentClass, accentForTopic, site } from "@/lib/content";
import { formatPostDate, getBlogPost, getBlogPosts, getPostContent } from "@/lib/notion";

// Needed for the static export (GitHub Pages); harmless elsewhere. With Notion
// unset there are no posts, so a placeholder keeps the build valid (it 404s).
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.length > 0
    ? posts.map((post) => ({ slug: post.slug }))
    : [{ slug: "no-posts-yet" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: `Blog — ${site.name}` };

  return {
    title: `${post.title} — ${site.name}`,
    description: post.summary,
  };
}

// `params` is awaited in here rather than in the page, so the static shell
// can be prerendered and only the post itself streams in.
async function Post({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const blocks = await getPostContent(post.id);
  const accent = accentClass[accentForTopic(post.topic)];

  return (
    <article className="px-4 md:px-8">
      <div className="flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] tracking-widest text-mute uppercase">
        <Link href="/blog" className="transition-colors hover:text-lime">
          ← All posts
        </Link>
        <span className={accent.text}>{post.topic}</span>
      </div>

      <h1 className="mt-10 max-w-4xl font-display text-[11vw] leading-[0.9] uppercase md:mt-16 md:text-[6vw]">
        <MaskText>{post.title}</MaskText>
      </h1>

      <Reveal className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-widest text-mute uppercase">
        <span>{formatPostDate(post.date)}</span>
        <span>{site.name}</span>
      </Reveal>

      {post.cover && (
        <Reveal className="relative mt-12 aspect-16/9 overflow-hidden rounded-md border border-line md:mt-16">
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(min-width: 768px) 90vw, 100vw"
            priority
            className="object-cover"
          />
        </Reveal>
      )}

      <div className="mt-14 flex max-w-3xl flex-col gap-6 pb-20 md:mt-20 md:pb-32">
        {post.summary && (
          <p className="font-heading text-xl leading-snug text-paper md:text-2xl">{post.summary}</p>
        )}

        <NotionContent blocks={blocks} />

        <Link
          href="/blog"
          data-cursor="Back"
          className={`mt-8 inline-flex w-fit items-center gap-3 rounded-full border px-6 py-3 font-mono text-[11px] tracking-widest uppercase transition-colors hover:bg-paper/5 ${accent.border} ${accent.text}`}
        >
          ← All posts
        </Link>
      </div>
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="px-4 md:px-8">
      <p className="border-t border-line pt-4 font-mono text-[11px] tracking-widest text-mute uppercase">
        Loading post…
      </p>
    </div>
  );
}

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <SiteHeader onHome={false} />
      <main className="pt-28 md:pt-36">
        <Suspense fallback={<PostSkeleton />}>
          <Post params={params} />
        </Suspense>
      </main>
      <ContactFooter />
    </>
  );
}
