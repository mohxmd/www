import type { Node, Parent, Visitor } from "./types";

/**
 * Traverse a syntax tree in depth-first order.
 *
 * Each node is visited before its children (preorder).
 * If `reverse` is true, children are visited right-to-left instead of left-to-right.
 */
export function visit(
  tree: Node,
  testOrVisitor: string | Visitor,
  visitorOrReverse?: Visitor | boolean,
  maybeReverse?: boolean
) {
  let test: string | undefined;
  let visitor: Visitor;
  let reverse: boolean | undefined;

  if (typeof testOrVisitor === "function") {
    visitor = testOrVisitor;
    reverse = visitorOrReverse as boolean | undefined;
  } else {
    test = testOrVisitor;
    visitor = visitorOrReverse as Visitor;
    reverse = maybeReverse;
  }

  function walk(node: Node, index?: number, parent?: Parent): boolean {
    if (!test || node.type === test) {
      if (visitor(node, index, parent)) return true;
    }

    const children = (node as Parent).children;
    if (children) {
      const entries = reverse ? [...children].reverse().entries() : children.entries();

      for (const [i, child] of entries) {
        if (walk(child, i, node as Parent)) return true;
      }
    }

    return false;
  }

  walk(tree);
}

// USAGE EXAMPLE
// const tree: Node = {
//   type: "root",
//   children: [
//     { type: "heading", value: "Title" },
//     {
//       type: "paragraph",
//       children: [{ type: "text", value: "Hello World" }],
//     },
//   ],
// };

// visit(tree, "text", (node) => {
//   console.log("Text node:", node);
// });
