import React, { useState } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { getComponentDefinition } from "../../registry/componentRegistry";
import { PropertyFieldRenderer } from "../properties/PropertyFieldRenderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown, MousePointer2, Copy, Layers } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RightPanelProps {
  mode?: "desktop" | "mobile";
}

export const RightPanel: React.FC<RightPanelProps> = ({ mode = "desktop" }) => {
  const {
    selectedNodeIds,
    canvasTree,
    updateNodeProps,
    deleteNode,
    duplicateNode,
    groupNodes,
    moveNodeUp,
    moveNodeDown,
    rootId
  } = useBuilderStore();
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("Group");
  const asideClass = mode === "desktop"
    ? "hidden h-[calc(100vh-3.5rem)] w-70 shrink-0 border-l bg-card lg:flex lg:flex-col"
    : "flex h-full w-full flex-col bg-card";


  const selectedNodeId = selectedNodeIds.length === 1 ? selectedNodeIds[0] : null;
  const selectedNode = selectedNodeId ? canvasTree[selectedNodeId] : null;
  const definition = selectedNode 
    ? (selectedNode.id === rootId 
        ? {
            name: "Root Canvas",
            propSchema: [{ key: "className", label: "Canvas Styles (Tailwind Classes)", type: "text" }],
            acceptsChildren: true
          }
        : getComponentDefinition(selectedNode.componentKey)) 
    : null;

  if (selectedNodeIds.length > 1) {
    return (
      <aside className={asideClass}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Multiple Selection</h2>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            {selectedNodeIds.length} Nodes
          </Badge>
        </div>
        
        <ScrollArea className="flex-1 h-full">
          <div className="space-y-4 p-4">
            <Card size="sm" className="py-3">
              <CardHeader className="border-b pb-2">
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground">
                You have {selectedNodeIds.length} elements selected. You can group them into a single container or delete them all.
                </p>
              
                <div className="space-y-2">
                <Button
                  className="h-9 w-full text-xs font-semibold"
                  onClick={() => { setGroupName("Group"); setGroupDialogOpen(true); }}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Group Selection
                </Button>

                <Button
                  variant="outline"
                  className="h-9 w-full text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setDeleteAllOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Selected Items</h3>
              {selectedNodeIds.map(id => (
                <div key={id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2 text-xs">
                  <span className="truncate max-w-[150px] font-medium">{canvasTree[id]?.componentKey || id}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => deleteNode(id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

              {/* Group name dialog */}
              <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Group selection</DialogTitle>
                    <DialogDescription>Enter a name for the new group container.</DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <Label htmlFor="group-name" className="text-xs font-semibold mb-1 block">Group Name</Label>
                    <Input
                      id="group-name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          groupNodes(selectedNodeIds, groupName);
                          setGroupDialogOpen(false);
                        }
                      }}
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" size="sm" onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
                    <Button
                      size="sm"
                      onClick={() => { groupNodes(selectedNodeIds, groupName); setGroupDialogOpen(false); }}
                      disabled={!groupName.trim()}
                    >
                      Create Group
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete all confirmation */}
              <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedNodeIds.length} elements?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the selected elements. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => { selectedNodeIds.forEach(id => deleteNode(id)); setDeleteAllOpen(false); }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
      </aside>
    );
  }

  if (!selectedNode || !definition) {
    return (
      <aside className={asideClass}>
        <div className="p-4">
          <Empty className="min-h-[220px] border bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MousePointer2 className="h-4 w-4" />
              </EmptyMedia>
              <EmptyTitle>No selection</EmptyTitle>
              <EmptyDescription>
                Select an element on the canvas to edit its properties.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </aside>
    );
  }

  return (
    <aside className={asideClass}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">{definition.name}</h2>
          <p className="text-[10px] text-muted-foreground">{selectedNode.id}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => duplicateNode(selectedNode.id)}
            disabled={selectedNode.id === rootId}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => moveNodeUp(selectedNode.id)}
            disabled={selectedNode.id === rootId}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => moveNodeDown(selectedNode.id)}
            disabled={selectedNode.id === rootId}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => deleteNode(selectedNode.id)}
            disabled={selectedNode.id === rootId}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-5 p-4">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
              {definition.acceptsChildren && <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>}
            </TabsList>

            <TabsContent value="properties" className="mt-3">
              <Card size="sm" className="py-3">
                <CardContent className="space-y-4 pt-1">
                  {definition.propSchema.map((field) => (
                    <PropertyFieldRenderer
                      key={field.key}
                      field={field}
                      value={selectedNode.props[field.key]}
                      onChange={(value) => updateNodeProps(selectedNode.id, { [field.key]: value })}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {definition.acceptsChildren && (
              <TabsContent value="layout" className="mt-3">
                <Separator className="my-2" />
                <div className="rounded-lg border border-dashed bg-muted/20 p-3">
                  <p className="text-center text-[10px] italic text-muted-foreground">
                    This component contains {selectedNode.children.length} children.
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </ScrollArea>

      <div className="border-t bg-muted/20 p-4">
        <Button
          variant="destructive"
          className="h-9 w-full text-xs font-semibold"
          onClick={() => deleteNode(selectedNode.id)}
          disabled={selectedNode.id === rootId}
        >
          Delete Element
        </Button>
      </div>
    </aside>
  );
};
