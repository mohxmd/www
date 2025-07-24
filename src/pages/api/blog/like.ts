export const prerender = false;

import type { APIRoute } from "astro";
import { getEntry, z } from "astro:content";
import { Like, db, eq, sql } from "astro:db";

const slugSchema = z
  .string()
  .refine(async (slug) => !!getEntry("blog", slug.trim()));

export const POST: APIRoute = async ({ request }) => {
  const payload = await z
    .object({ slug: slugSchema })
    .safeParseAsync(await request.json());

  if (!payload.success) {
    return new Response("Bad Request", { status: 400 });
  }

  // Check if the post already exists in the Likes table
  const existingLike = await db
    .select()
    .from(Like)
    .where(eq(Like.post, payload.data.slug));

  console.log(existingLike);

  if (existingLike[0]) {
    // Post exists, increment the like count
    await db
      .update(Like)
      .set({ likes: sql`${Like.likes} + 1` })
      .where(eq(Like.post, payload.data.slug));
  } else {
    // Post doesn't exist, add the post and initialize the like count to 1
    await db.insert(Like).values({ post: payload.data.slug, likes: 1 });
  }

  return new Response("Post liked successfully", { status: 200 });
};
