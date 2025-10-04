import { z } from "astro/zod";
import { getCollection, render } from "astro:content";

export type GetSortedPosts = Awaited<ReturnType<typeof getSortedPosts>>;
export type GetAllTags = Awaited<ReturnType<typeof getAllTags>>;

export const POSTS_PAGE_SIZE = 10;

export const getSortedPosts = async () =>
  await Promise.all(
    (await getCollection("blog"))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(async (post) => {
        const { remarkPluginFrontmatter, ...renderedData } = await render(post);
        const remarkData = z
          .object({ readingTime: z.string() })
          .parse(remarkPluginFrontmatter);
        const tags = post.data.tags.map((tag) => ({
          id: tag.toLowerCase().replace(/\s/g, "-"),
          text: tag,
        }));
        return {
          ...post,
          data: { ...post.data, ...remarkData, tags },
          ...renderedData,
        };
      }),
  );

export const getAllTags = async () =>
  [...new Set((await getCollection("blog")).flatMap((post) => post.data.tags))]
    .sort()
    .map((tags) => ({
      id: tags.toLowerCase().replace(/\s/g, "-"),
      text: tags,
    }));

export const getPopularTags = async (minCount = 2) => {
  const posts = await getCollection("blog");

  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([_, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => ({
      id: tag.toLowerCase().replace(/\s/g, "-"),
      text: tag,
    }));
};
