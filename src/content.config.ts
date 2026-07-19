import { Octokit } from "@octokit/rest";
import { defineCollection, type ImageFunction } from "astro:content";
import { GITHUB_TOKEN, USERNAME } from "astro:env/server";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const octokit = new Octokit(GITHUB_TOKEN ? { auth: GITHUB_TOKEN } : {});
const githubOwner = USERNAME ?? "mohammedsh";

const getHomepageLabel = (url: string | null) => {
  if (!url) return null;

  try {
    const { hostname, pathname } = new URL(url);

    if (hostname === "www.npmjs.com" && pathname.startsWith("/package/")) {
      return "NPM";
    }

    if (hostname === "jsr.io") {
      return "JSR";
    }
  } catch {
    return "Demo";
  }

  return "Demo";
};

const getRepo = async (repo: string) => {
  try {
    return await octokit.repos.get({ owner: githubOwner, repo });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Skipping GitHub metadata for ${repo}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return null;
  }
};

const blogSchema = ({ image }: { image: ImageFunction }) =>
  z.object({
    title: z.string(),
    description: z.string(),
    image: image(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Mohammed"),
    draft: z.boolean().default(false),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    repo: z
      .string()
      .transform(async (repo) => {
        if (!repo) return null;
        const response = await getRepo(repo);
        if (!response) return null;

        return {
          name: response.data.name,
          description: response.data.description,
          language: response.data.language,
          stargazers: response.data.stargazers_count,
          forks: response.data.forks_count,
          watchers: response.data.watchers_count,
          githubUrl: response.data.html_url,
          websiteUrl: response.data.homepage,
        };
      })
      .optional(),
  });

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  stars: z.number(),
  forks: z.number(),
  watchers: z.number(),
  topics: z.array(z.string()),
  githubUrl: z.url(),
  homepageUrl: z.url().nullable(),
  homepageLabel: z.string().nullable(),
  language: z.string().optional(),
  createdAt: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

const REPO_NAMES = [
  "vaultlet",
  "drizzle-redis-cache",
  "dbstudio",
  "kiln",
  "breeze-graphql-starter",
  "pychat-app",
  "sass-kit",
  "mohx-cli",
  "echo-mohx",
  "honobox",
] as const;

export const collections = {
  blog: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/blog",
    }),
    schema: blogSchema,
  }),
  projects: defineCollection({
    loader: async () => {
      const repos = await Promise.all(REPO_NAMES.map(getRepo));

      return repos.flatMap((response) =>
        response
          ? [
              {
                id: response.data.id.toString(),
                name: response.data.name,
                description: response.data.description ?? "",
                stars: response.data.stargazers_count,
                forks: response.data.forks_count,
                watchers: response.data.watchers_count,
                topics: response.data.topics ?? [],
                githubUrl: response.data.html_url,
                homepageUrl: response.data.homepage || null,
                homepageLabel: getHomepageLabel(response.data.homepage || null),
                language: response.data.language ?? undefined,
                createdAt: response.data.created_at,
                isPrivate: response.data.private,
              },
            ]
          : []
      );
    },
    schema: projectSchema,
  }),
};

export type BlogSchema = z.infer<ReturnType<typeof blogSchema>>;
export type ProjectSchema = z.infer<typeof projectSchema>;
