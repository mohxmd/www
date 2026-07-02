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

    if (current.depth === 2) {
      parents.clear();
      parents.set(current.depth, current);
      toc.push(current);
      continue;
    }

    for (const depth of [...parents.keys()]) {
      if (depth >= current.depth) parents.delete(depth);
    }

    const parent =
      parents.get(current.depth - 1) ??
      [...parents.entries()]
        .sort(([a], [b]) => b - a)
        .find(([depth]) => depth < current.depth)?.[1];

    if (parent) {
      parent.subheadings!.push(current);
      parents.set(current.depth, current);
    }
  }

  return toc;
}
