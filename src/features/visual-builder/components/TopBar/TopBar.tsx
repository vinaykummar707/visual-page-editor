import React, { useEffect } from "react";
import { Undo2, Redo2, Save, ArrowLeft, Monitor, Tablet, Smartphone, Trash, PanelLeft, PanelRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBuilderStore } from "../../store/builder.store";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onOpenComponentsPanel?: () => void;
  onOpenInspectorPanel?: () => void;
  hasSelection?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenComponentsPanel,
  onOpenInspectorPanel,
  hasSelection = false,
}) => {
  const { 
    undo, 
    redo, 
    save, 
    historyPast, 
    historyFuture, 
    viewport, 
    setViewport,
    clearCanvas 
  } = useBuilderStore();
  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
      if (e.key === "s") { e.preventDefault(); save(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, save]);


  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-3 px-3 md:px-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1 lg:hidden">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onOpenComponentsPanel} aria-label="Open component panel">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onOpenInspectorPanel} aria-label="Open inspector panel" disabled={!hasSelection}>
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold tracking-tight md:text-lg">Visual Builder</h1>
          <Badge variant="secondary" className="hidden text-[10px] font-medium uppercase tracking-wide sm:inline-flex">
            Editor
          </Badge>
        </div>
      </div>

      <div className="hidden items-center gap-1 rounded-lg border bg-muted/40 p-1 md:flex">
        <Button
          variant={viewport === "mobile" ? "secondary" : "ghost"}
          size="icon"
          className={cn("h-8 w-8", viewport === "mobile" && "bg-background shadow-sm")}
          onClick={() => setViewport("mobile")}
          aria-label="Set mobile viewport"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
        <Button
          variant={viewport === "tablet" ? "secondary" : "ghost"}
          size="icon"
          className={cn("h-8 w-8", viewport === "tablet" && "bg-background shadow-sm")}
          onClick={() => setViewport("tablet")}
          aria-label="Set tablet viewport"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={viewport === "desktop" ? "secondary" : "ghost"}
          size="icon"
          className={cn("h-8 w-8", viewport === "desktop" && "bg-background shadow-sm")}
          onClick={() => setViewport("desktop")}
          aria-label="Set desktop viewport"
        >
          <Monitor className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyPast.length === 0}
              className="h-8 px-2 md:px-3"
            >
              <Undo2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Undo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Undo <kbd className="ml-1 rounded bg-muted px-1 font-mono text-[10px]">Ctrl+Z</kbd></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyFuture.length === 0}
              className="h-8 px-2 md:px-3"
            >
              <Redo2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Redo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Redo <kbd className="ml-1 rounded bg-muted px-1 font-mono text-[10px]">Ctrl+Y</kbd></TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-1 hidden h-6 md:block" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden h-8 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive md:inline-flex"
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear canvas?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove all components from the canvas. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearCanvas}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Clear canvas
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button size="sm" onClick={save} className="h-8 px-3 md:px-4">
          <Save className="h-4 w-4 mr-2" />
          <span>Save</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 md:hidden" aria-label="More actions">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setViewport("mobile")}>
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewport("tablet")}>
              <Tablet className="mr-2 h-4 w-4" />
              Tablet View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewport("desktop")}>
              <Monitor className="mr-2 h-4 w-4" />
              Desktop View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearCanvas} className="text-destructive focus:text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Clear Canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
    </header>
  );
};
