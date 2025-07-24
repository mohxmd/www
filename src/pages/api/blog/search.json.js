import { getCollection } from "astro:content";

import { nonDraftPosts, markdownToPlainText } from "@/lib/index";
import { calculateReadingTime } from "@/lib/readingTime";

async function getPosts() {
  const blogs = (await getCollection("blog")).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );

  const posts = nonDraftPosts(blogs).map((post) => {
    const readingTime = calculateReadingTime(post.body);

    return {
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      image: post.data.image,
      tags: post.data.tags,
      author: post.data.author,
      pubDate: post.data.pubDate,
      readingTime: readingTime,
    };
  });

  return posts;
}

export async function GET({}) {
  return new Response(JSON.stringify(await getPosts()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
