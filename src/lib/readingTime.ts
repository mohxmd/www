export function calculateReadingTime(
  mdxContent: string,
  wordsPerMinute: number = 200,
): number {
  // Remove front matter
  const contentWithoutFrontmatter = mdxContent.replace(
    /^---[\s\S]*?---\n/m,
    "",
  );

  // Remove code blocks
  const contentWithoutCode = contentWithoutFrontmatter.replace(
    /```[\s\S]*?```/g,
    "",
  );

  // Remove inline code
  const contentWithoutInlineCode = contentWithoutCode.replace(/`[^`\n]+`/g, "");

  // Remove URLs
  const contentWithoutUrls = contentWithoutInlineCode.replace(/http\S+/g, "");

  // Remove headers
  const contentWithoutHeaders = contentWithoutUrls.replace(/^\s*#+.*$/gm, "");

  // Remove image syntax
  const contentWithoutImages = contentWithoutHeaders.replace(
    /!\[.*?\]\(.*?\)/g,
    "",
  );

  // Remove HTML-like tags (including custom components)
  const contentWithoutHtml = contentWithoutImages.replace(/<[^>]*>/g, "");

  // Remove import statements
  const contentWithoutImports = contentWithoutHtml.replace(/^import.*$/gm, "");

  // Count words
  const words = contentWithoutImports.match(/\w+/g) || [];
  const wordCount = words.length;

  // Calculate reading time
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
}
