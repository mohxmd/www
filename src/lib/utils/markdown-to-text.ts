/*
 * Modern markdown AST to plain text converter
 * Extracts clean text content from parsed markdown nodes for blog processing
 */

type Options = {
  includeImageAlt?: boolean;
  includeHtml?: boolean;
};

type NodeLike = {
  type?: string;
  value?: string;
  alt?: string;
  children?: unknown[];
};

export function toText(value?: unknown, options: Options = {}): string {
  const { includeImageAlt = true, includeHtml = true } = options;
  return processNode(value, includeImageAlt, includeHtml);
}

function processNode(
  value: unknown,
  includeImageAlt: boolean,
  includeHtml: boolean,
): string {
  if (isNode(value)) {
    if ("value" in value) {
      return value.type === "html" && !includeHtml
        ? ""
        : (value.value as string);
    }

    if (includeImageAlt && "alt" in value && value.alt) {
      return value.alt as string;
    }

    if ("children" in value && Array.isArray(value.children)) {
      return processArray(value.children, includeImageAlt, includeHtml);
    }
  }

  if (Array.isArray(value)) {
    return processArray(value, includeImageAlt, includeHtml);
  }

  return "";
}

function processArray(
  values: unknown[],
  includeImageAlt: boolean,
  includeHtml: boolean,
): string {
  return values
    .map((value) => processNode(value, includeImageAlt, includeHtml))
    .join("");
}

function isNode(value: unknown): value is NodeLike {
  return value !== null && typeof value === "object";
}
