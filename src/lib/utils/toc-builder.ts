type Heading = {
  slug: string;
  depth: number;
  text: string;
  subheadings?: Heading[];
};

/**
 * Builds a nested Table of Contents (TOC) from a flat list of headings.
 * Groups child headings (H3–H6) under their nearest parent heading (H2).
 */
export function buildToc(headings: Heading[]): Heading[] {
  if (!headings.length) return [];

  const toc: Heading[] = [];
  const parents = new Map<number, Heading>();

  for (const h of headings) {
    const current: Heading = { ...h, subheadings: [] };
    parents.set(current.depth, current);

    if (current.depth === 2) {
      toc.push(current);
      continue;
    }

    const parent = parents.get(current.depth - 1);
    if (parent) parent.subheadings!.push(current);
  }

  return toc;
}
