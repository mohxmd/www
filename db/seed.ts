import { getCollection } from "astro:content";
import { db, Like, PostView } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  // await db
  // 	.insert(Like)
  // 	.values(
  // 		(await getCollection("blog")).map((post) => ({ post: post.slug }))
  // 	)
  // PostView
  // await db
  // 	.insert(PostView)
  // 	.values(
  // 		(await getCollection("blog")).map((post) => ({ post: post.slug }))
  // 	)
}
