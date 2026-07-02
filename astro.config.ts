import { defineConfig, envField, fontProviders } from "astro/config";

import node from "@astrojs/node";
import vercel from "@astrojs/vercel";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import alpine from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";
import icon from "astro-icon";
import { unified } from "@astrojs/markdown-remark";
import prettyCode, { type Options as PrettyCodeOption } from "rehype-pretty-code";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { readingTime, toText } from "./src/lib/utils";

const useNodeAdapter = process.env.ASTRO_ADAPTER === "node";

export default defineConfig({
  site: "https://mohammedsh.xyz",
  adapter: useNodeAdapter
    ? node({ mode: "standalone" })
    : vercel({
        webAnalytics: { enabled: true },
        imageService: true,
      }),
  prefetch: true,

  markdown: {
    syntaxHighlight: false,
    processor: unified({
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
    }),
  },

  env: {
    schema: {
      USERNAME: envField.string({ context: "server", access: "secret" }),
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      TURSO_DATABASE_URL: envField.string({ context: "server", access: "secret", optional: true }),
      TURSO_AUTH_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },

  fonts: [
    { name: "Noto Sans", type: "sans", weights: "100 900" },
    { name: "IBM Plex Mono", type: "mono", weights: "100 700" },
  ].map((font) => ({
    provider: fontProviders.fontsource(),
    name: font.name,
    cssVariable: `--font-${font.type}`,
    weights: [font.weights],
    subsets: ["latin"],
    styles: ["normal"],
  })),

  vite: { plugins: [tailwindcss()], logLevel: "info" },

  integrations: [
    mdx(),
    icon(),
    alpine({ entrypoint: "/alpine.config.ts" }),
    sitemap({ changefreq: "daily", lastmod: new Date() }),
    robotsTxt({ policy: [{ userAgent: "*", disallow: ["/404"] }] }),
  ],
});
