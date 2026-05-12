import React, { useState } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, Layout, Type, Layers, Shapes } from "lucide-react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryIcons: Record<string, any> = {
  basic: Shapes,
  layout: Layout,
  form: Type,
  display: Layers,
};

interface LeftPanelProps {
  mode?: "desktop" | "mobile";
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ mode = "desktop" }) => {
  const { componentPalette, addNode } = useBuilderStore();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBySearch = query.trim()
    ? componentPalette.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : componentPalette;

  const filtered = activeTab === "all"
    ? filteredBySearch
    : filteredBySearch.filter((c) => c.category === activeTab);

  const categories = Array.from(new Set(filtered.map((c) => c.category)));
  const panelClassName = mode === "desktop"
    ? "hidden h-[calc(100vh-3.5rem)] w-70 shrink-0 border-r bg-card lg:flex lg:flex-col"
    : "flex h-full w-full flex-col bg-card";

  return (
    <aside className={panelClassName}>
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Components</h2>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            {componentPalette.length}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Click a component to add it to the canvas</p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
            className="h-8 pl-8 text-xs"
            aria-label="Search components"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <TabsList variant="line" className="w-full justify-start gap-0.5 rounded-lg bg-muted/30 p-1">
            <TabsTrigger value="all" className="h-7 px-2 text-[11px]">All</TabsTrigger>
            <TabsTrigger value="basic" className="h-7 px-2 text-[11px]">Basic</TabsTrigger>
            <TabsTrigger value="layout" className="h-7 px-2 text-[11px]">Layout</TabsTrigger>
            <TabsTrigger value="form" className="h-7 px-2 text-[11px]">Form</TabsTrigger>
            <TabsTrigger value="display" className="h-7 px-2 text-[11px]">Display</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-5 p-4">
          {filtered.length === 0 && (
            <Empty className="border bg-muted/20">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search className="h-4 w-4" />
                </EmptyMedia>
                <EmptyTitle>No components found</EmptyTitle>
                <EmptyDescription>
                  Try a different search for &quot;{query}&quot;.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {categories.map((category) => {
            const Icon = categoryIcons[category] || Box;
            const categoryItems = filtered.filter((c) => c.category === category);
            return (
              <Card key={category} size="sm" className="gap-2 py-2">
                <CardHeader className="border-b pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {category}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {categoryItems.length}
                    </Badge>
                  </div>
                  <CardDescription className="sr-only">Components in the {category} category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-1">
                  {categoryItems.map((comp) => (
                    <button
                      key={comp.key}
                      onClick={() => addNode(comp.key)}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-lg border bg-background px-3 py-2 text-left transition-colors",
                        "hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <div className="mt-0.5 rounded-md bg-muted p-1.5 transition-colors group-hover:bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium">{comp.name}</div>
                        {comp.description && (
                          <div className="line-clamp-1 text-[10px] text-muted-foreground">{comp.description}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};
