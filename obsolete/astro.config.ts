import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import vercel from "@astrojs/vercel";
import db from "@astrojs/db";
import alpine from "@astrojs/alpinejs";

import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
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
  adapter: vercel({ webAnalytics: { enabled: true }, imageService: true }),

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [rehypeAutolinkHeadings, autolinkHeadingsOptions],

      () => (tree, vfile) => {
        const data = vfile.data as {
          astro: { frontmatter: Record<string, unknown> };
        };
        const payload = Math.round(readingTime(toString(tree)).minutes);
        data.astro.frontmatter.readingTime = `${payload} Min Read`;

        visit(tree, "element", (node) => {
          if (node.properties?.["data-rehype-pretty-code-title"] !== "") return;
          node.tagName = "div";
          node.properties.slot = "title";
        });
      },
    ],
  },

  env: {
    schema: {
      USERNAME: envField.string({ context: "server", access: "secret" }),
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret" }),
    },
  },

  experimental: {
    fonts: [
      { name: "Geist", type: "sans", weights: "100 900" },
      { name: "Geist Mono", type: "mono", weights: "100 900" },
    ].map((font) => ({
      provider: fontProviders.fontsource(),
      name: font.name,
      cssVariable: `--font-${font.type}`,
      weights: [font.weights],
      subsets: ["latin"],
      styles: ["normal"],
    })),
  },

  integrations: [
    mdx(),
    db(),
    pagefind(),
    alpine({ entrypoint: "/alpine.config.ts" }),
    sitemap({ changefreq: "daily", lastmod: new Date() }),
    robotsTxt({
      policy: [{ userAgent: "*", disallow: ["/404"] }],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
