export type CanvasNodeId = string;

export type CanvasNodeType = "root" | "layout" | "component";

export interface CanvasNodeBase {
  id: CanvasNodeId;
  type: CanvasNodeType;
  componentKey: string;
  parentId: CanvasNodeId | null;
  children: CanvasNodeId[];
  props: Record<string, any>;
}

export interface CanvasRootNode extends CanvasNodeBase {
  type: "root";
  componentKey: "canvas-root";
  parentId: null;
}

export type CanvasNode = CanvasNodeBase;
