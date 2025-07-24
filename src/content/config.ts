import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const blogSchema = z
  .object({
    title: z.string().min(1, "Title must not be empty"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    image: z
      .object({
        src: z.string().url("Image src must be a valid URL"),
        alt: z.string().default(""),
      })
      .optional(),
    tags: z
      .array(z.string())
      .min(1, "At least one tag is required")
      .refine(
        (tags) => tags.every((tag) => tag.trim().length > 0),
        "Tags must not be empty strings",
      ),
    author: z.string().default("Mohammed"),
    draft: z.boolean().default(false),
    pubDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "pubDate must be in YYYY-MM-DD format"),
    updatedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedDate must be in YYYY-MM-DD format")
      .optional(),
  })
  .strict();

const projectSchema = z
  .object({
    title: z.string().min(1, "Project title must not be empty"),
    description: z
      .string()
      .min(10, "Project description must be at least 10 characters"),
    url: z.string().url("Project URL must be a valid URL").optional(),
    githubUrl: z.string().url("GitHub URL must be a valid URL").optional(),
    tags: z.array(z.string()).optional(),
    technologies: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          icon: z.string().optional(),
        }),
      )
      .optional(),
    featured: z.boolean().default(false),
  })
  .strict();

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "@/content/blog" }),
  schema: blogSchema.transform((data) => ({
    ...data,
    pubDate: new Date(data.pubDate),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
  })),
});

const project = defineCollection({
  loader: file("@/content/data/projects.json"),
  schema: projectSchema,
});

// Export the collections
export { blog, project };

// Export the inferred types
export type BlogPost = z.infer<typeof blogSchema>;
export type Project = z.infer<typeof projectSchema>;
