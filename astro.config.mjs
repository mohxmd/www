import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import vercel from "@astrojs/vercel/serverless";
import db from "@astrojs/db";

import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { toString } from "mdast-util-to-string";
import readingTime from "reading-time";
import { visit } from "unist-util-visit";

const prettyCodeOptions = {
  theme: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
  keepBackground: false,
};

const autolinkHeadingsOptions = {
  behavior: "prepend",
  content: {
    type: "text",
    value: "#",
  },
  headingProperties: {
    className: ["anchor"],
  },
  properties: {
    className: ["anchor-link"],
  },
};

export default defineConfig({
  site: "https://mohammedsh.xyz",
  trailingSlash: "never",
  output: "hybrid",
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
    devImageService: "sharp",
  }),

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [rehypeAutolinkHeadings, autolinkHeadingsOptions],

      () => (tree, vfile) => {
        const data = vfile.data;
        const payload = Math.round(readingTime(toString(tree)).minutes);
        data.astro.frontmatter.readingTime = payload;

        visit(tree, "element", (node) => {
          if (node.properties?.["data-rehype-pretty-code-title"] !== "") return;
          node.tagName = "div";
          node.properties.slot = "title";
        });
      },
    ],
  },

  integrations: [
    mdx(),
    sitemap({ changefreq: "daily", lastmod: new Date() }),
    robotsTxt({
      policy: [{ userAgent: "*", disallow: ["/404"] }],
    }),
    ,
    db(),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
