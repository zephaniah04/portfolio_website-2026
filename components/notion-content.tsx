// Renders Notion blocks as the site's own typography. Server component: the
// blocks arrive already fetched, so nothing here needs the client.

import Image from "next/image";
import { blockPayload, type NotionBlock, type RichText } from "@/lib/notion";

function Text({ parts }: { parts: RichText[] | undefined }) {
  if (!parts?.length) return null;

  return (
    <>
      {parts.map((part, i) => {
        const { annotations: a } = part;
        let node: React.ReactNode = part.plain_text;

        if (a.code) node = <code className="rounded bg-ink-soft px-1.5 py-0.5 font-mono text-[0.9em] text-lime">{node}</code>;
        if (a.bold) node = <strong className="font-semibold text-paper">{node}</strong>;
        if (a.italic) node = <em>{node}</em>;
        if (a.underline) node = <u>{node}</u>;
        if (a.strikethrough) node = <s className="text-mute">{node}</s>;
        if (part.href) {
          node = (
            <a
              href={part.href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-lime decoration-2 underline-offset-4 transition-colors hover:text-lime"
            >
              {node}
            </a>
          );
        }

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

// Consecutive list items arrive as separate blocks, so they are wrapped into
// one <ul>/<ol> before rendering.
type Run = { kind: "list"; ordered: boolean; items: NotionBlock[] } | { kind: "block"; block: NotionBlock };

function toRuns(blocks: NotionBlock[]): Run[] {
  const runs: Run[] = [];

  for (const block of blocks) {
    const ordered = block.type === "numbered_list_item";
    const isItem = ordered || block.type === "bulleted_list_item";
    const last = runs.at(-1);

    if (isItem && last?.kind === "list" && last.ordered === ordered) {
      last.items.push(block);
    } else if (isItem) {
      runs.push({ kind: "list", ordered, items: [block] });
    } else {
      runs.push({ kind: "block", block });
    }
  }

  return runs;
}

function Block({ block }: { block: NotionBlock }) {
  const payload = blockPayload(block);
  const text = <Text parts={payload.rich_text} />;

  switch (block.type) {
    case "paragraph":
      if (!payload.rich_text?.length) return null;
      return <p className="text-base leading-relaxed text-paper/75 md:text-lg">{text}</p>;

    case "heading_1":
      return (
        <h2 className="mt-6 font-display text-4xl leading-none uppercase md:text-6xl">{text}</h2>
      );

    case "heading_2":
      return (
        <h3 className="mt-4 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {text}
        </h3>
      );

    case "heading_3":
      return (
        <h4 className="mt-2 font-mono text-[11px] tracking-widest text-lime uppercase">{text}</h4>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-lime pl-5 font-heading text-xl leading-snug text-paper md:text-2xl">
          {text}
        </blockquote>
      );

    case "callout":
      return (
        <aside className="flex gap-4 rounded-md border border-line bg-ink-soft p-5 text-sm leading-relaxed text-paper/80">
          {payload.icon?.emoji && <span aria-hidden>{payload.icon.emoji}</span>}
          <span>{text}</span>
        </aside>
      );

    case "to_do":
      return (
        <p className="flex items-start gap-3 text-base leading-relaxed text-paper/75">
          <span aria-hidden className="font-mono text-lime">
            {payload.checked ? "[x]" : "[ ]"}
          </span>
          <span className={payload.checked ? "text-mute line-through" : undefined}>{text}</span>
        </p>
      );

    case "code":
      return (
        <pre className="overflow-x-auto rounded-md border border-line bg-ink-soft p-5 font-mono text-xs leading-relaxed text-paper/80">
          <code>{(payload.rich_text ?? []).map((part) => part.plain_text).join("")}</code>
        </pre>
      );

    case "divider":
      return <hr className="border-line" />;

    case "image": {
      const src = payload.external?.url ?? payload.file?.url;
      if (!src) return null;
      return (
        <figure className="flex flex-col gap-3">
          <div className="relative aspect-3/2 overflow-hidden rounded-md border border-line">
            <Image src={src} alt={payload.caption?.map((c) => c.plain_text).join("") ?? ""} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
          </div>
          {payload.caption?.length ? (
            <figcaption className="font-mono text-[11px] tracking-widest text-mute uppercase">
              <Text parts={payload.caption} />
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "toggle":
      return (
        <details className="rounded-md border border-line bg-ink-soft p-5">
          <summary className="cursor-pointer font-heading text-lg font-semibold tracking-tight">
            {text}
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            <NotionContent blocks={block.children} />
          </div>
        </details>
      );

    case "bookmark":
    case "embed":
    case "link_preview":
      if (!payload.url) return null;
      return (
        <a
          href={payload.url}
          target="_blank"
          rel="noreferrer"
          className="block truncate rounded-md border border-line bg-ink-soft px-5 py-4 font-mono text-xs tracking-wide text-paper/70 transition-colors hover:border-lime hover:text-lime"
        >
          {payload.url} ↗
        </a>
      );

    default:
      // Unsupported block types fall back to their text, if they have any.
      if (!payload.rich_text?.length) return null;
      return <p className="text-base leading-relaxed text-paper/75">{text}</p>;
  }
}

export function NotionContent({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <>
      {toRuns(blocks).map((run, i) => {
        if (run.kind === "block") return <Block key={run.block.id} block={run.block} />;

        const List = run.ordered ? "ol" : "ul";
        return (
          <List
            key={`list-${i}`}
            className={`flex flex-col gap-2 pl-6 text-base leading-relaxed text-paper/75 ${
              run.ordered ? "list-decimal" : "list-disc"
            } marker:text-lime`}
          >
            {run.items.map((item) => (
              <li key={item.id}>
                <Text parts={blockPayload(item).rich_text} />
                {item.children.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    <NotionContent blocks={item.children} />
                  </div>
                )}
              </li>
            ))}
          </List>
        );
      })}
    </>
  );
}
