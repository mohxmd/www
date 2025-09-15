import { defineConfig, envField, fontProviders } from "astro/config";

import vercel from "@astrojs/vercel";
// import node from "@astrojs/node";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import db from "@astrojs/db";
import alpine from "@astrojs/alpinejs";
import robotsTxt from "astro-robots-txt";

import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import pagefind from "astro-pagefind";

import { createCssVariablesTheme } from "shiki";
import { transformerNotationDiff } from "@shikijs/transformers";
import prettyCode, {
  type Options as PrettyCodeOption,
} from "rehype-pretty-code";

import { readingTime, toText } from "./src/lib/utils";

const oneDarkProTheme = createCssVariablesTheme({
  name: "one-dark-pro",
  variablePrefix: "--code-",
  variableDefaults: {
    "token-constant": "#d19a66",
    "token-string": "#98c379",
    "token-comment": "#7f848e",
    "token-keyword": "#c678dd",
    "token-parameter": "#e06c75",
    "token-function": "#61afef",
    "token-string-expression": "#98c379",
    "token-punctuation": "#abb2bf",
    "token-link": "#61afef",
  },
});

// const adapter =
//   process.env.NODE_ENV === "production"
//     ? vercel({ webAnalytics: { enabled: true }, imageService: true })
//     : node({ mode: "standalone" });

export default defineConfig({
  site: "https://mohammedsh.xyz",
  adapter: vercel({ webAnalytics: { enabled: true }, imageService: true }),
  // server: { port: 4322, host: true },
  prefetch: true,
  security: {
    checkOrigin: true,
  },

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        prettyCode,
        {
          theme: oneDarkProTheme,
          wrap: true,
          transformers: [transformerNotationDiff()],
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
    fonts: [{ name: "Oswald", type: "sans", weights: "100 900" }].map(
      (font) => ({
        provider: fontProviders.fontsource(),
        name: font.name,
        cssVariable: `--font-${font.type}`,
        weights: [font.weights],
        subsets: ["latin"],
        styles: ["normal"],
      }),
    ),
  },

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

  vite: { plugins: [tailwindcss()] },
});
