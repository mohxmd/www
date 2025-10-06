/* eslint-disable no-console */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { type BlogSchema } from "#/content/config";

// Utility to sanitize the title into a slug
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Utility to get the current date in YYYY-MM-DD format
function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Main function to create the MDX file
function createBlogPost(title: string) {
  const blogDir = join(process.cwd(), "src/content/blog");
  if (!existsSync(blogDir)) {
    mkdirSync(blogDir, { recursive: true });
  }

  // Generate a unique filename
  const date = getCurrentDate();
  const slug = createSlug(title);
  const filename = `${date}-${slug}.mdx`;
  const filepath = join(blogDir, filename);

  // Check if the file already exists
  if (existsSync(filepath)) {
    console.error(`Error: File "${filename}" already exists. Please use a different title.`);
    process.exit(1);
  }

  // Define the frontmatter data based on the BlogPost type
  const frontmatter: Omit<BlogSchema, "pubDate" | "updatedDate" | "image" | "repo"> & {
    pubDate: string;
    updatedDate?: string;
  } = {
    title,
    description: "A brief description of your blog post.",
    tags: ["tech"],
    author: "Mohammed",
    draft: true,
    pubDate: date,
  };

  // Generate the MDX content
  const content = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
tags: [${frontmatter.tags.map((tag) => `"${tag}"`).join(", ")}]
author: "${frontmatter.author}"
draft: ${frontmatter.draft}
pubDate: "${frontmatter.pubDate}"
---

# ${frontmatter.title}

Write your blog post content here!
`;

  // Write the file
  try {
    writeFileSync(filepath, content, "utf-8");
    console.log(`Success: Created blog post at ${filepath}`);
  } catch (error) {
    console.error(`Error: Failed to create blog post: ${error}`);
    process.exit(1);
  }
}

// Run the script
const title = process.argv[2];
if (!title) {
  console.error("Error: Please provide a title for the blog post.");
  console.error("Usage: bun run create-post <title>");
  process.exit(1);
}

createBlogPost(title);
