/**
 * Search API Endpoint
 *
 * Provides JSON endpoint with all blog posts for client-side search.
 * Endpoint: /api/blog/search.json
 *
 * Returns lightweight post data (excludes heavy content like body, headings)
 * for fast client-side filtering.
 */

export const prerender = false;

import { getSortedPosts } from "#/content/utils";
import type { APIRoute } from "astro";

export interface SearchPost {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  author: string;
  pubDate: string;
  readingTime: string;
}

/**
 * Transform heavy post data into lightweight search data
 */
async function getSearchablePosts(): Promise<SearchPost[]> {
  const posts = await getSortedPosts();

  return posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    image: post.data.image?.src,
    tags: post.data.tags.map((tag) => tag.text),
    author: post.data.author,
    pubDate: post.data.pubDate.toISOString(),
    readingTime: post.data.readingTime,
  }));
}

/**
 * GET /api/blog/search.json
 * Returns all posts in searchable format
 */
export const GET: APIRoute = async () => {
  try {
    const posts = await getSearchablePosts();

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch posts", cause: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
