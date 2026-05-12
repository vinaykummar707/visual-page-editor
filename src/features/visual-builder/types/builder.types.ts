import type { CanvasNode } from "./canvas-node.types";
import  type  { ComponentDefinition } from "./component-definition.types";

export type Viewport = "mobile" | "tablet" | "desktop";

export interface BuilderState {
  canvasTree: Record<string, CanvasNode>;
  rootId: string;

  /** Primary selected node (single selection). Null when 0 or >1 nodes are selected. */
  selectedNodeId: string | null;
  /** All currently selected node ids (supports multi-select). */
  selectedNodeIds: string[];

  historyPast: Array<Record<string, CanvasNode>>;
  historyFuture: Array<Record<string, CanvasNode>>;

  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;

  componentPalette: ComponentDefinition[];

  addNode: (componentKey: string, parentId?: string) => void;
  selectNode: (nodeId: string | null, multi?: boolean) => void;
  updateNodeProps: (nodeId: string, props: Record<string, any>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  groupNodes: (nodeIds: string[], groupName: string) => void;
  clearCanvas: () => void;
  moveNodeUp: (nodeId: string) => void;
  moveNodeDown: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
  save: () => void;
  clearSelection: () => void;
}
