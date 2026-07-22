import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { siteConfig } from "#/configs/site";
import { getSortedPosts } from "#/content/utils";

export const prerender = true;

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    stylesheet: "/rss/styles.xsl",
    title: `${siteConfig.title}`,
    trailingSlash: false,
    description: siteConfig.description,
    customData: "<language>en-us</language>",
    site: String(context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      link: `/blog/${post.id}`,
      categories: post.data.tags.map((tag) => tag.text),
    })),
  });
}
