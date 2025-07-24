export function getLanguageIcon(language?: string, filename?: string): string {
  const icons: Record<string, string> = {
    js: "/lang/js.svg",
    javascript: "/lang/js.svg",
    ts: "/lang/ts.svg",
    typescript: "/lang/ts.svg",
    jsx: "/lang/jsx.svg",
    tsx: "/lang/tsx.svg",
    python: "/lang/py.svg",
    html: "/lang/html.svg",
    css: "/lang/cdd.svg",
    cpp: "/lang/cpp.svg",
    c: "/lang/c.svg",
    astro: "/lang/astro.svg",
    sh: "/lang/shell.svg",
    vite: "/lang/vite.svg",
  };

  if (filename?.includes("vite.config.js")) {
    return "/lang/vite.svg";
  }

  if (filename?.includes("package.json")) {
    return "/lang/node.svg";
  }

  if (!language) {
    return "/lang/file.svg";
  }

  return icons[language.toLowerCase()] || "/lang/file.svg";
}
