import React from "react";
import { useBuilderStore } from "../../store/builder.store";
import { CanvasNodeRenderer } from "./CanvasNodeRenderer";
import { cn } from "@/lib/utils";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Sparkles } from "lucide-react";

const viewportWidths: Record<string, string> = {
  mobile: "max-w-[375px]",
  tablet: "max-w-[768px]",
  desktop: "max-w-full",
};

export const Canvas: React.FC = () => {
  const { canvasTree, rootId, clearSelection, viewport } = useBuilderStore();
  const hasChildren = canvasTree[rootId]?.children.length > 0;

  return (
    <main
      className="relative flex-1 overflow-hidden  transition-all duration-300 "
      onClick={clearSelection}
    >
      
      <div className={cn("h-full transition-all duration-300", viewportWidths[viewport] )}>
        <CanvasNodeRenderer nodeId={rootId} />
      </div>
    </main>
  );
};
