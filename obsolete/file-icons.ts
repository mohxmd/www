const LANGUAGE_ICONS: Record<string, string> = {
  js: "/lang/js.svg",
  javascript: "/lang/js.svg",
  ts: "/lang/ts.svg",
  typescript: "/lang/ts.svg",
  jsx: "/lang/jsx.svg",
  tsx: "/lang/tsx.svg",
  python: "/lang/py.svg",
  py: "/lang/py.svg",
  html: "/lang/html.svg",
  css: "/lang/css.svg",
  scss: "/lang/css.svg",
  sass: "/lang/css.svg",
  cpp: "/lang/cpp.svg",
  "c++": "/lang/cpp.svg",
  c: "/lang/c.svg",
  astro: "/lang/astro.svg",
  sh: "/lang/shell.svg",
  bash: "/lang/shell.svg",
  zsh: "/lang/shell.svg",
  powershell: "/lang/shell.svg",
  json: "/lang/node.svg",
  md: "/lang/markdown.svg",
  markdown: "/lang/markdown.svg",
  yaml: "/lang/config.svg",
  yml: "/lang/config.svg",
  toml: "/lang/config.svg",
  xml: "/lang/html.svg",
  php: "/lang/php.svg",
  java: "/lang/java.svg",
  go: "/lang/go.svg",
  rust: "/lang/rust.svg",
  rs: "/lang/rust.svg",
  vue: "/lang/vue.svg",
  svelte: "/lang/svelte.svg",
  dockerfile: "/lang/docker.svg",
} as const;

// Special file patterns that override language detection
const SPECIAL_FILES: Record<string, string> = {
  "vite.config": "/lang/vite.svg",
  "vite.config.js": "/lang/vite.svg",
  "vite.config.ts": "/lang/vite.svg",
  "package.json": "/lang/node.svg",
  "package-lock.json": "/lang/node.svg",
  "yarn.lock": "/lang/node.svg",
  "pnpm-lock.yaml": "/lang/node.svg",
  "tsconfig.json": "/lang/ts.svg",
  "jsconfig.json": "/lang/js.svg",
  "tailwind.config.js": "/lang/tailwind.svg",
  "tailwind.config.ts": "/lang/tailwind.svg",
  ".env": "/lang/config.svg",
  ".env.local": "/lang/config.svg",
  ".env.example": "/lang/config.svg",
  dockerfile: "/lang/docker.svg",
  "docker-compose.yml": "/lang/docker.svg",
  "docker-compose.yaml": "/lang/docker.svg",
  ".gitignore": "/lang/git.svg",
  ".gitattributes": "/lang/git.svg",
  "readme.md": "/lang/readme.svg",
  license: "/lang/license.svg",
  makefile: "/lang/makefile.svg",
} as const;

const DEFAULT_ICON = "/lang/file.svg";

export function getFileIcon(language?: string, filename?: string): string {
  if (!language && !filename) {
    return DEFAULT_ICON;
  }

  if (filename) {
    const lowerFilename = filename.toLowerCase();
    const basename = lowerFilename.split("/").pop() || "";

    if (SPECIAL_FILES[basename]) {
      return SPECIAL_FILES[basename];
    }

    for (const [pattern, icon] of Object.entries(SPECIAL_FILES)) {
      if (basename.includes(pattern)) {
        return icon;
      }
    }

    if (!language) {
      const extension = basename.split(".").pop();
      if (extension && extension !== basename) {
        return LANGUAGE_ICONS[extension] || DEFAULT_ICON;
      }
    }
  }

  if (language) {
    const normalizedLanguage = language.toLowerCase().trim();
    return LANGUAGE_ICONS[normalizedLanguage] || DEFAULT_ICON;
  }

  return DEFAULT_ICON;
}

const iconCache = new Map<string, string>();

export function getFileIconCached(
  language?: string,
  filename?: string,
): string {
  const cacheKey = `${language || ""}:${filename || ""}`;

  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!;
  }

  const result = getFileIcon(language, filename);
  iconCache.set(cacheKey, result);

  return result;
}

export function getFileExtension(filename: string): string | null {
  const basename = filename.split("/").pop() || "";
  const parts = basename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : null;
}

export function isConfigFile(filename: string): boolean {
  const basename = filename.toLowerCase().split("/").pop() || "";
  return Object.keys(SPECIAL_FILES).some(
    (pattern) => basename === pattern || basename.includes(pattern),
  );
}
