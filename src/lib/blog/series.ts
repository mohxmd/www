import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { getSortedPosts, type GetSortedPosts } from "#/content/utils";

export type SeriesEntry = CollectionEntry<"series">;

export type SeriesSummary = {
  slug: string;
  entry: SeriesEntry;
};

export type SeriesPost = GetSortedPosts[0] & {
  data: GetSortedPosts[0]["data"] & {
    series: string;
    seriesOrder: number;
  };
};

export type PostSeriesContext = {
  series: SeriesSummary;
  posts: SeriesPost[];
  currentIndex: number;
  currentPost: SeriesPost;
  previousPost: SeriesPost | null;
  nextPost: SeriesPost | null;
};

/**
 * Converts the content collection id for `series/<slug>/index.mdx` into the
 * public route slug used by blog post frontmatter.
 */
export function getSeriesSlug(entry: SeriesEntry) {
  return entry.id.replace(/\/index$/, "");
}

export async function getPublishedSeries(): Promise<SeriesSummary[]> {
  return (await getCollection("series"))
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({ slug: getSeriesSlug(entry), entry }))
    .sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
}

export async function getSeriesBySlug(slug: string) {
  return (await getPublishedSeries()).find((series) => series.slug === slug) ?? null;
}

/**
 * Returns all public blog posts assigned to one series, ordered like a playlist.
 */
export async function getSeriesPosts(slug: string): Promise<SeriesPost[]> {
  return (await getSortedPosts())
    .filter((post): post is SeriesPost => post.data.series === slug && Boolean(post.data.seriesOrder))
    .sort((a, b) => a.data.seriesOrder - b.data.seriesOrder);
}

export async function getPostSeriesContext(postId: string): Promise<PostSeriesContext | null> {
  const currentPost = (await getSortedPosts()).find((post) => post.id === postId);
  if (!currentPost?.data.series) return null;

  const series = await getSeriesBySlug(currentPost.data.series);
  if (!series) return null;

  const posts = await getSeriesPosts(series.slug);
  const currentIndex = posts.findIndex((post) => post.id === postId);
  if (currentIndex === -1) return null;

  return {
    series,
    posts,
    currentIndex,
    currentPost: posts[currentIndex]!,
    previousPost: posts[currentIndex - 1] ?? null,
    nextPost: posts[currentIndex + 1] ?? null,
  };
}
