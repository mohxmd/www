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
