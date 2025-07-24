interface Heading {
  slug: string;
  depth: number;
  text: string;
  subheadings?: Heading[];
}

export function buildToc(headings: Heading[]): Heading[] {
  const toc: Heading[] = [];
  const parentHeadings: Map<number, Heading> = new Map();

  headings.forEach((h) => {
    const heading: Heading = { ...h, subheadings: [] };
    parentHeadings.set(heading.depth, heading);

    if (heading.depth === 2) {
      toc.push(heading);
    } else {
      const parentHeading = parentHeadings.get(heading.depth - 1);
      if (parentHeading && parentHeading.subheadings) {
        parentHeading.subheadings.push(heading);
      }
    }
  });

  return toc;
}
