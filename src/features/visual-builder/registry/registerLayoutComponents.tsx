import type { ComponentDefinition } from "../types/component-definition.types";
import type { CanvasNode } from "../types/canvas-node.types";
import { cn } from "@/lib/utils";

export const registerLayoutComponents: Record<string, ComponentDefinition> = {
  flex: {
    key: "flex",
    name: "Flex",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {
      direction: "row",
      gap: 4,
      justify: "start",
      align: "start",
      wrap: false,
      className: "flex p-4 border border-dashed border-gray-300 rounded-md",
    },
    propSchema: [
      {
        key: "direction",
        label: "Direction",
        type: "select",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
        ],
      },
      { key: "gap", label: "Gap", type: "number" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      {
        key: "justify",
        label: "Justify",
        type: "select",
        options: [
          { label: "Start", value: "start" },
          { label: "Center", value: "center" },
          { label: "End", value: "end" },
          { label: "Between", value: "between" },
          { label: "Around", value: "around" },
        ],
      },
      {
        key: "align",
        label: "Align",
        type: "select",
        options: [
          { label: "Start", value: "start" },
          { label: "Center", value: "center" },
          { label: "End", value: "end" },
          { label: "Stretch", value: "stretch" },
        ],
      },
      { key: "wrap", label: "Wrap", type: "switch" },
    ],
    render: (node, context) => {
      const justifyMap: Record<string, string> = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
      };
      const alignMap: Record<string, string> = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      };

      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
          }}
          className={cn(
            "min-h-[50px] transition-all",
            node.props.direction === "column" ? "flex-col" : "flex-row",
            justifyMap[node.props.justify] || "justify-start",
            alignMap[node.props.align] || "items-start",
            node.props.wrap ? "flex-wrap" : "flex-nowrap",
            node.props.className
          )}
          style={{ gap: `${(node.props.gap || 0) * 4}px` }}
        >
          {/* Children will be rendered here by the recursive renderer */}
          {/* This render function just provides the container */}
        </div>
      );
    },
  },
  grid: {
    key: "grid",
    name: "Grid",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {
      columns: 2,
      gap: 4,
      className: "grid min-h-[50px] p-4 border border-dashed border-gray-300 rounded-md",
    },
    propSchema: [
      { key: "columns", label: "Columns", type: "number" },
      { key: "gap", label: "Gap", type: "number" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
        className={cn(
          "transition-all",
          node.props.className
        )}
        style={{
          gridTemplateColumns: `repeat(${node.props.columns}, minmax(0, 1fr))`,
          gap: `${(node.props.gap || 0) * 4}px`,
        }}
      >
      </div>
    ),
  },
  box: {
    key: "box",
    name: "Box",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {
      padding: 4,
      className: "min-h-[50px] border border-dashed border-gray-300 rounded-md",
    },
    propSchema: [
      { key: "padding", label: "Padding", type: "number" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
        className={cn(
          "transition-all",
          node.props.className
        )}
        style={{ padding: `${(node.props.padding || 0) * 4}px` }}
      >
      </div>
    ),
  },
  section: {
    key: "section",
    name: "Section",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {
      title: "Section Title",
      padding: 6,
      bg: "transparent",
      className: "min-h-[100px] border border-dashed border-gray-300 rounded-lg",
    },
    propSchema: [
      { key: "title", label: "Title", type: "text" },
      { key: "padding", label: "Padding", type: "number" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
      {
        key: "bg",
        label: "Background",
        type: "select",
        options: [
          { label: "Transparent", value: "transparent" },
          { label: "Gray", value: "bg-gray-50" },
          { label: "Blue", value: "bg-blue-50" },
          { label: "White", value: "bg-white" },
        ],
      },
    ],
    render: (node, context) => (
      <section
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
        className={cn(
          "transition-all",
          node.props.bg,
          node.props.className
        )}
        style={{ padding: `${(node.props.padding || 0) * 4}px` }}
      >
        <h3 className="text-lg font-bold mb-4">{node.props.title}</h3>
      </section>
    ),
  },
  stack: {
    key: "stack",
    name: "Stack",
    category: "layout",
    acceptsChildren: true,
    defaultProps: {
      gap: 4,
      className: "flex flex-col min-h-[50px] border border-dashed border-gray-300 rounded-md p-4",
    },
    propSchema: [
      { key: "gap", label: "Gap", type: "number" },
      { key: "className", label: "Custom Tailwind Classes", type: "text" },
    ],
    render: (node, context) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          context.onSelectNode(node.id, e.ctrlKey || e.metaKey);
        }}
        className={cn(
          "transition-all",
          node.props.className
        )}
        style={{ gap: `${(node.props.gap || 0) * 4}px` }}
      >
      </div>
    ),
  },

};
