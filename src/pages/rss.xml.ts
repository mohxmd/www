import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getSortedPosts } from "#/content/utils";

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    stylesheet: "/rss/styles.xsl",
    title: "Mohammed's Blog",
    trailingSlash: false,
    description: "Tech enthusiast sharing coding tips and tech insights. Join the coding journey!",
    site: String(context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      link: `/blog/${post.id}/`,
    })),
  });
}
