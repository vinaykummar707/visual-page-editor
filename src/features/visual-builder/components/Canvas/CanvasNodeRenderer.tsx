import React from "react";
import { useBuilderStore } from "../../store/builder.store";
import { getComponentDefinition } from "../../registry/componentRegistry";
import type { CanvasNodeId } from "../../types/canvas-node.types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CanvasNodeRendererProps {
  nodeId: CanvasNodeId;
}

export const CanvasNodeRenderer: React.FC<CanvasNodeRendererProps> = ({ nodeId }) => {
  const { canvasTree, selectedNodeIds, selectNode, rootId } = useBuilderStore();
  const node = canvasTree[nodeId];

  if (!node) return null;

  const definition = getComponentDefinition(node.componentKey);

  // Root node renders its children directly — no component definition needed
  if (node.type === "root") {
    const isSelected = selectedNodeIds.includes(rootId);
    return (
      <div
        className={cn(
          "  p-4  transition-all",
          isSelected ? "border-primary/70 ring-2 ring-primary/20" : "hover:border-primary/40",node.props.className
        )}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(rootId, e.ctrlKey || e.metaKey);
        }}
      >
        
        {node.children.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center   py-40 text-muted-foreground">
            <p className="text-sm font-medium">Canvas is empty</p>
            <p className="text-xs mt-1">Add components from the left panel</p>
          </div>
        ) : (
          <>
            {node.children.map((childId) => (
              <CanvasNodeRenderer key={childId} nodeId={childId} />
            ))}
          </>
        )}
      </div>
    );
  }

  if (!definition) {
    return (
      <div className="rounded border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
        Unknown component: {node.componentKey}
      </div>
    );
  }

  const isSelected = selectedNodeIds.includes(node.id);

  const renderedComponent = definition.render(node, {
    selectedNodeId: selectedNodeIds.length === 1 ? selectedNodeIds[0] : null,
    selectedNodeIds,
    onSelectNode: selectNode,
  });

  // Layout / container components: inject children into the rendered element
  if (definition.acceptsChildren) {
    const renderedElement = renderedComponent as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;

    return (
      <div className="relative group/node">
        <div className="pointer-events-none absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/node:opacity-100">
          <Badge variant="outline" className="text-[10px]">Layout</Badge>
        </div>
        {React.cloneElement(renderedElement, {
          children: (
            <>
              {node.children.length === 0 ? (
                <div className="pointer-events-none select-none rounded border border-dashed border-border bg-muted/20 p-4 text-center text-[10px] text-muted-foreground">
                  Empty Container
                </div>
              ) : (
                node.children.map((childId) => (
                  <CanvasNodeRenderer key={childId} nodeId={childId} />
                ))
              )}
            </>
          ),
          className: cn(
            renderedElement.props.className,
            "rounded-md transition-all",
            isSelected && "scale-[1.01] ring-2 ring-primary/70 ring-offset-2"
          ),
        })}
      </div>
    );
  }

  // Leaf components
  return (
    <div
      className={cn(
        "relative transition-all",
        isSelected && "z-10 scale-[1.01] rounded-md ring-2 ring-primary/70 ring-offset-2"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(node.id, e.ctrlKey || e.metaKey);
      }}
    >
      {renderedComponent}
    </div>
  );
};
