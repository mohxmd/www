import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { getSortedPosts, type GetSortedPosts } from "#/content/utils";

export type ArcEntry = CollectionEntry<"arcs">;

export type ArcSummary = {
  slug: string;
  entry: ArcEntry;
};

export type ArcPost = GetSortedPosts[0] & {
  data: GetSortedPosts[0]["data"] & {
    arc: string;
    arcOrder: number;
  };
};

export type PostArcContext = {
  arc: ArcSummary;
  posts: ArcPost[];
  currentIndex: number;
  currentPost: ArcPost;
  previousPost: ArcPost | null;
  nextPost: ArcPost | null;
};

/**
 * Converts the content collection id for `arcs/<slug>/index.mdx` into the
 * public route slug used by blog post frontmatter.
 */
export function getArcSlug(entry: ArcEntry) {
  return entry.id.replace(/\/index$/, "");
}

export async function getPublishedArcs(): Promise<ArcSummary[]> {
  return (await getCollection("arcs"))
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({ slug: getArcSlug(entry), entry }))
    .sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
}

export async function getArcBySlug(slug: string) {
  return (await getPublishedArcs()).find((arc) => arc.slug === slug) ?? null;
}

/**
 * Returns all public blog posts assigned to one arc, ordered by part number.
 */
export async function getArcPosts(slug: string): Promise<ArcPost[]> {
  return (await getSortedPosts())
    .filter((post): post is ArcPost => post.data.arc === slug && Boolean(post.data.arcOrder))
    .sort((a, b) => a.data.arcOrder - b.data.arcOrder);
}

export async function getPostArcContext(postId: string): Promise<PostArcContext | null> {
  const currentPost = (await getSortedPosts()).find((post) => post.id === postId);
  if (!currentPost?.data.arc) return null;

  const arc = await getArcBySlug(currentPost.data.arc);
  if (!arc) return null;

  const posts = await getArcPosts(arc.slug);
  const currentIndex = posts.findIndex((post) => post.id === postId);
  if (currentIndex === -1) return null;

  return {
    arc,
    posts,
    currentIndex,
    currentPost: posts[currentIndex]!,
    previousPost: posts[currentIndex - 1] ?? null,
    nextPost: posts[currentIndex + 1] ?? null,
  };
}
