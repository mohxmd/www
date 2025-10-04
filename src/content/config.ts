import { Octokit } from "@octokit/rest";
import { glob } from "astro/loaders";
import { defineCollection, z, type ImageFunction } from "astro:content";
import { GITHUB_TOKEN, USERNAME } from "astro:env/server";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

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
      .optional()
      .transform(async (repo) => {
        if (!repo) return null;
        return octokit.repos.get({ owner: USERNAME, repo }).then((response) => ({
          name: response.data.name,
          description: response.data.description,
          language: response.data.language,
          stargazers: response.data.stargazers_count,
          forks: response.data.forks_count,
          watchers: response.data.watchers_count,
          githubUrl: response.data.homepage,
          websiteUrl: response.data.html_url,
        }));
      }),
  });

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  stars: z.number(),
  forks: z.number(),
  watchers: z.number(),
  topics: z.array(z.string()),
  githubUrl: z.string().url(),
  language: z.string().optional(),
  createdAt: z.string().optional(),
  isPrivate: z.boolean().optional(),
  // websiteUrl: z.string().url(),
});

const REPO_NAMES = [
  "oryft",
  "breeze-graphql-starter",
  "sass-kit",
  "honobox",
  "pychat-app",
  "tic-tac-toe-react-native",
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
    loader: async () =>
      Promise.all(
        REPO_NAMES.map((repo) =>
          octokit.repos.get({ owner: USERNAME, repo }).then((response) => ({
            id: response.data.id.toString(),
            name: response.data.name,
            description: response.data.description,
            stars: response.data.stargazers_count,
            forks: response.data.forks_count,
            watchers: response.data.watchers_count,
            topics: response.data.topics,
            githubUrl: response.data.html_url,
            language: response.data.language,
            createdAt: response.data.created_at,
            isPrivate: response.data.private,
            // websiteUrl: response.data.created_at,
          }))
        )
      ),
    schema: projectSchema,
  }),
};

export type BlogSchema = z.infer<ReturnType<typeof blogSchema>>;
export type ProjectSchema = z.infer<typeof projectSchema>;
