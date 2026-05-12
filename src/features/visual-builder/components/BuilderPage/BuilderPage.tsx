import React, { useState } from "react";
import { TopBar } from "../TopBar/TopBar";
import { LeftPanel } from "../LeftPanel/LeftPanel";
import { Canvas } from "../Canvas/Canvas";
import { RightPanel } from "../RightPanel/RightPanel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBuilderStore } from "../../store/builder.store";

export const BuilderPage: React.FC = () => {
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const hasSelection = useBuilderStore((state) => state.selectedNodeIds.length > 0);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        onOpenComponentsPanel={() => setComponentsOpen(true)}
        onOpenInspectorPanel={() => setInspectorOpen(true)}
        hasSelection={hasSelection}
      />
      <div className="flex flex-1 overflow-hidden bg-muted/20">
        <LeftPanel />
        <Canvas />
        <RightPanel />
      </div>

      <Sheet open={componentsOpen} onOpenChange={setComponentsOpen}>
        <SheetContent side="left" className="w-[320px] p-0 sm:w-[360px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Component Library</SheetTitle>
            <SheetDescription>Insert components into the canvas.</SheetDescription>
          </SheetHeader>
          <LeftPanel mode="mobile" />
        </SheetContent>
      </Sheet>

      <Sheet open={inspectorOpen} onOpenChange={setInspectorOpen}>
        <SheetContent side="right" className="w-[320px] p-0 sm:w-[360px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Inspector</SheetTitle>
            <SheetDescription>Edit selected node properties.</SheetDescription>
          </SheetHeader>
          <RightPanel mode="mobile" />
        </SheetContent>
      </Sheet>
    </div>
  );
};
