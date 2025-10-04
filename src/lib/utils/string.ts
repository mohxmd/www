export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function truncateSafe(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLength)).trim() + "…";
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("en-US", {
    weekday: "short", // Sun
    month: "short", // Aug
    day: "numeric", // 11
    year: "numeric", // 2024
  });
}
