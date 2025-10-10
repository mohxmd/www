import { defineConfig, envField, fontProviders } from "astro/config";

import vercel from "@astrojs/vercel";
import node from "@astrojs/node";

import db from "@astrojs/db";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import alpine from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";
import icon from "astro-icon";
import pagefind from "astro-pagefind";

import prettyCode, { type Options as PrettyCodeOption } from "rehype-pretty-code";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { readingTime, toText } from "./src/lib/utils";

const adapter =
  process.env.NODE_ENV === "development"
    ? node({ mode: "standalone" })
    : vercel({ webAnalytics: { enabled: true }, imageService: true });

export default defineConfig({
  site: "https://mohammedsh.xyz",
  adapter,
  prefetch: true,

  markdown: {
    syntaxHighlight: false,
    gfm: true,
    smartypants: true,
    rehypePlugins: [
      [
        prettyCode,
        {
          theme: "vitesse-black",
          wrap: true,
          defaultLang: "bash",
          bypassInlineCode: true,
          transformers: [
            transformerNotationDiff({ matchAlgorithm: "v3" }),
            transformerNotationHighlight({ matchAlgorithm: "v3" }),
            transformerNotationWordHighlight({ matchAlgorithm: "v3" }),
            transformerNotationFocus({ matchAlgorithm: "v3" }),
            transformerNotationErrorLevel({ matchAlgorithm: "v3" }),
          ],
        } as PrettyCodeOption,
      ],
      () => (tree, vfile) => {
        const data = vfile.data as {
          astro: { frontmatter: Record<string, unknown> };
        };
        const payload = Math.round(readingTime(toText(tree)).minutes);
        data.astro.frontmatter.readingTime = `${payload} Min Read`;
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
      {
        name: "Noto Sans",
        type: "sans",
        weights: "100 900",
      },
      {
        name: "IBM Plex Mono",
        type: "mono",
        weights: "100 700",
      },
    ].map((font) => ({
      provider: fontProviders.fontsource(),
      name: font.name,
      cssVariable: `--font-${font.type}`,
      weights: [font.weights],
      subsets: ["latin"],
      styles: ["normal"],
    })),
  },

  vite: { plugins: [tailwindcss()], logLevel: "info" },

  integrations: [
    mdx(),
    db(),
    icon(),
    pagefind(),
    alpine({ entrypoint: "/alpine.config.ts" }),
    sitemap({ changefreq: "daily", lastmod: new Date() }),
    robotsTxt({
      policy: [{ userAgent: "*", disallow: ["/404"] }],
    }),
  ],
});
