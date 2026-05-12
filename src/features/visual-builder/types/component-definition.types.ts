import React from "react";
import type { CanvasNode } from "./canvas-node.types";

export interface RenderContext {
  selectedNodeId: string | null;
  selectedNodeIds?: string[];
  onSelectNode: (nodeId: string, multi?: boolean) => void;
}

export interface ComponentPropField {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "switch"
    | "number"
    | "color"
    | "json"
    | "size"
    | "variant";
  description?: string;
  defaultValue?: any;
  options?: Array<{
    label: string;
    value: string;
  }>;
  required?: boolean;
}

export interface ComponentDefinition {
  key: string;
  name: string;
  category: "basic" | "layout" | "form" | "display";
  description?: string;

  acceptsChildren: boolean;
  maxChildren?: number;

  defaultProps: Record<string, any>;
  propSchema: ComponentPropField[];

  render: (node: CanvasNode, context: RenderContext) => React.ReactNode;
}
