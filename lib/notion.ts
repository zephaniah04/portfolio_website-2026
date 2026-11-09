// Reads the blog from Notion through the official API.
//
// Two environment variables drive this (see .env.example):
//   NOTION_TOKEN               internal integration secret
//   NOTION_BLOG_DATABASE_ID    the "Blog" database the integration can read
//
// With either one missing, every function here returns empty data and the blog
// page renders its "not connected yet" state instead of crashing the build.

import { cacheLife, cacheTag } from "next/cache";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export const BLOG_CACHE_TAG = "blog";

export type RichText = {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  summary: string;
  date: string | null;
  cover: string | null;
  notionUrl: string;
};

export type NotionBlock = {
  id: string;
  type: string;
  has_children: boolean;
  children: NotionBlock[];
};

// Only the slices of Notion's payloads this site actually reads.
type NotionPropertyValue = {
  type: string;
  title?: RichText[];
  rich_text?: RichText[];
  select?: { name: string } | null;
  date?: { start: string | null } | null;
  url?: string | null;
};

type NotionFile = { url: string };

type NotionPage = {
  id: string;
  url: string;
  properties: Record<string, NotionPropertyValue>;
  cover?: { type: string; external?: NotionFile; file?: NotionFile } | null;
};

type NotionList<T> = {
  results: T[];
  has_more: boolean;
  next_cursor: string | null;
};

export type BlockPayload = {
  rich_text?: RichText[];
  caption?: RichText[];
  language?: string;
  url?: string;
  external?: NotionFile;
  file?: NotionFile;
  checked?: boolean;
  icon?: { emoji?: string } | null;
};

async function notionRequest<T>(path: string, body?: unknown): Promise<T | null> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`${NOTION_API}${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      console.error(`Notion ${path} → ${res.status}: ${await res.text()}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Notion ${path} failed`, error);
    return null;
  }
}

function plainText(parts: RichText[] | undefined): string {
  return (parts ?? []).map((part) => part.plain_text).join("");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileUrl(source: NotionFile | undefined | null): string | null {
  return source?.url ?? null;
}

function toPost(page: NotionPage): BlogPost {
  const props = page.properties ?? {};
  const title = plainText(props.Name?.title) || "Untitled";
  const slug = plainText(props.Slug?.rich_text) || slugify(title) || page.id;

  return {
    id: page.id,
    slug,
    title,
    topic: props.Topic?.select?.name ?? "Notes",
    summary: plainText(props.Summary?.rich_text),
    date: props.Published?.date?.start ?? null,
    cover:
      props.Cover?.url ??
      fileUrl(page.cover?.external) ??
      fileUrl(page.cover?.file) ??
      null,
    notionUrl: page.url,
  };
}

/** Every published post, newest first. Empty when Notion isn't configured. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(BLOG_CACHE_TAG);

  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
  if (!databaseId) return [];

  const query = {
    page_size: 100,
    filter: { property: "Status", select: { equals: "Published" } },
    sorts: [{ property: "Published", direction: "descending" }],
  };

  const pages: NotionPage[] = [];
  let cursor: string | null = null;

  do {
    const body: Record<string, unknown> = cursor ? { ...query, start_cursor: cursor } : query;
    const data: NotionList<NotionPage> | null = await notionRequest<NotionList<NotionPage>>(
      `/databases/${databaseId}/query`,
      body,
    );
    if (!data) break;
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  return pages.map(toPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Posts grouped by their Topic, in the order the topics first appear. */
export function groupByTopic(posts: BlogPost[]): { topic: string; posts: BlogPost[] }[] {
  const groups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const bucket = groups.get(post.topic);
    if (bucket) bucket.push(post);
    else groups.set(post.topic, [post]);
  }
  return [...groups].map(([topic, grouped]) => ({ topic, posts: grouped }));
}

export function blockPayload(block: NotionBlock): BlockPayload {
  return ((block as unknown as Record<string, BlockPayload>)[block.type] ?? {}) as BlockPayload;
}

async function fetchChildren(blockId: string, depth: number): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | null = null;

  do {
    const suffix: string = cursor ? `&start_cursor=${cursor}` : "";
    const data: NotionList<NotionBlock> | null = await notionRequest<NotionList<NotionBlock>>(
      `/blocks/${blockId}/children?page_size=100${suffix}`,
    );
    if (!data) break;
    blocks.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);

  // Nested lists and toggles need one more level; stop there so a deep page
  // can't fan out into hundreds of requests.
  return Promise.all(
    blocks.map(async (block) => ({
      ...block,
      children:
        block.has_children && depth > 0 ? await fetchChildren(block.id, depth - 1) : [],
    })),
  );
}

/** The body of one post, as Notion blocks. */
export async function getPostContent(pageId: string): Promise<NotionBlock[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(BLOG_CACHE_TAG);

  return fetchChildren(pageId, 2);
}

/** 20 Oct 2026 — the date format used across the blog. */
export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
