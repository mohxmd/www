export type Data = {
  [key: string]: unknown;
};

export type Point = {
  line: number;
  column: number;
  offset?: number;
};

export type Position = {
  start: Point;
  end: Point;
};

export type Node = {
  type: string;
  data?: Data;
  position?: Position;
};

export type Parent = Node & {
  children: Node[];
};

export type Visitor = (node: Node, index?: number, parent?: Parent) => boolean | void;
