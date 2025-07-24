export const prerender = false;

import type { APIRoute } from "astro";
import { getEntry, z } from "astro:content";
import { PostView, db, eq, sql } from "astro:db";
import { sum } from "drizzle-orm";

const viewsFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const slugSchema = z
  .string()
  .refine(async (slug) => !!getEntry("blog", slug.trim()));

export const PUT: APIRoute = async ({ request }) => {
  try {
    const payload = await z
      .object({ slug: slugSchema })
      .safeParseAsync(await request.json());

    if (!payload.success) return new Response("Bad Request", { status: 400 });

    const postExists = await db
      .select()
      .from(PostView)
      .where(eq(PostView.post, payload.data.slug));

    if (postExists[0]) {
      const [rs] = await db
        .update(PostView)
        .set({ views: sql`${PostView.views} + 1` })
        .where(eq(PostView.post, payload.data.slug))
        .returning({ views: PostView.views });

      return new Response(rs?.views?.toString() ?? null, { status: 200 });
    } else {
      await db.insert(PostView).values({ post: payload.data.slug, views: 1 });

      return new Response("1", { status: 200 });
    }
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  try {
    const [rs] = await db
      .select({ totalViews: sum(PostView.views) })
      .from(PostView);
    return new Response(viewsFormatter.format(Number(rs?.totalViews ?? 0)), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
