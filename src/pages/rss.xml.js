import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

// utils
import { sortByDate, nonDraftPosts } from "@/lib/index";

export async function GET(context) {
  const posts = await getCollection("blog");
  const nonDraftPosts_ = nonDraftPosts(posts);
  const sortedPosts = sortByDate(nonDraftPosts_);

  return rss({
    stylesheet: "/rss/styles.xsl",
    title: "Mohammed’s Blog",
    description:
      "Tech enthusiast sharing coding tips and tech insights. Join the coding journey!",
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      customData: post.data.customData,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}/`,
    })),
  });
}
