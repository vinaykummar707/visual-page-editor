import { create } from "zustand";
import type { BuilderState } from "../types/builder.types";
import type { CanvasNode } from "../types/canvas-node.types";
import { componentRegistry } from "../registry/componentRegistry";
import {
  createNode,
  insertNode,
  deleteNodeRecursive,
  updateNodeProps,
  moveNode,
  duplicateNodeRecursive,
} from "../utils/tree/treeUtils";

const INITIAL_ROOT_ID = "canvas-root";

const createInitialTree = (): Record<string, CanvasNode> => {
  return {
    [INITIAL_ROOT_ID]: {
      id: INITIAL_ROOT_ID,
      type: "root",
      componentKey: "canvas-root",
      parentId: null,
      children: [],
      props: {},
    },
  };
};

const MAX_HISTORY_SIZE = 100;

/** Append current tree to history, evicting oldest entry when limit is reached. */
const pushHistory = (
  past: Array<Record<string, CanvasNode>>,
  current: Record<string, CanvasNode>
): Array<Record<string, CanvasNode>> => [...past, current].slice(-MAX_HISTORY_SIZE);

export const useBuilderStore = create<BuilderState>((set, get) => ({
  canvasTree: createInitialTree(),
  rootId: INITIAL_ROOT_ID,
  selectedNodeIds: [],
  selectedNodeId: null,
  historyPast: [],
  historyFuture: [],
  viewport: "desktop",
  setViewport: (viewport) => set({ viewport }),
  componentPalette: Object.values(componentRegistry),

  addNode: (componentKey: string, parentId?: string) => {
    const { canvasTree, selectedNodeIds, rootId } = get();
    
    // Default to last selected node if it's a layout component, otherwise root
    const lastSelectedId = selectedNodeIds[selectedNodeIds.length - 1];
    let targetParentId = parentId || lastSelectedId || rootId;
    const parentNode = canvasTree[targetParentId];
    
    // If selected is not a layout, use its parent
    if (parentNode && parentNode.type !== "layout" && parentNode.type !== "root") {
      targetParentId = parentNode.parentId || rootId;
    }

    const newNode = createNode(componentKey, targetParentId);
    const newTree = insertNode(canvasTree, newNode, targetParentId);

    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
      selectedNodeIds: [newNode.id],
      selectedNodeId: newNode.id,
    }));
  },

  selectNode: (nodeId: string | null, multi = false) => {
    set((state) => {
      if (!nodeId) return { selectedNodeIds: [], selectedNodeId: null };
      
      const newSelections = multi 
        ? (state.selectedNodeIds.includes(nodeId) 
            ? state.selectedNodeIds.filter(id => id !== nodeId)
            : [...state.selectedNodeIds, nodeId])
        : [nodeId];
        
      return { 
        selectedNodeIds: newSelections,
        selectedNodeId: newSelections.length === 1 ? newSelections[0] : null
      };
    });
  },

  updateNodeProps: (nodeId: string, props: Record<string, any>) => {
    const { canvasTree } = get();
    const newTree = updateNodeProps(canvasTree, nodeId, props);

    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
    }));
  },

  deleteNode: (nodeId: string) => {
    const { canvasTree, rootId } = get();
    if (nodeId === rootId) return;

    const newTree = deleteNodeRecursive(canvasTree, nodeId);

    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
      selectedNodeIds: state.selectedNodeIds.filter(id => id !== nodeId),
      selectedNodeId: null,
    }));
  },

  duplicateNode: (nodeId: string) => {
    const { canvasTree, rootId } = get();
    if (nodeId === rootId) return;

    const { tree: newTree, newNodeId } = duplicateNodeRecursive(canvasTree, nodeId);

    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
      selectedNodeIds: [newNodeId],
      selectedNodeId: newNodeId,
    }));
  },

  groupNodes: (nodeIds: string[], groupName: string) => {
    if (nodeIds.length < 2) return;
    const { canvasTree, rootId } = get();
    
    // Find a common parent or use first node's parent
    const firstNode = canvasTree[nodeIds[0]];
    if (!firstNode) return;
    const parentId = firstNode.parentId || rootId;

    // Create group node (Box)
    const groupNode = createNode("box", parentId);
    groupNode.props.title = groupName;
    groupNode.props.className = "flex flex-col gap-4 p-4 border border-dashed border-gray-300 rounded-lg";
    
    let newTree = { ...canvasTree, [groupNode.id]: groupNode };
    
    // Add group to parent's children
    const parent = canvasTree[parentId];
    if (parent) {
      newTree[parentId] = {
        ...parent,
        children: [...parent.children, groupNode.id]
      };
    }

    // Move children into group
    nodeIds.forEach(id => {
      const node = newTree[id];
      if (!node) return;

      // Remove from current parent
      if (node.parentId && newTree[node.parentId]) {
        newTree[node.parentId] = {
          ...newTree[node.parentId],
          children: newTree[node.parentId].children.filter(cid => cid !== id)
        };
      }

      // Update node parent
      newTree[id] = { ...node, parentId: groupNode.id };
      
      // Add to group children
      newTree[groupNode.id] = {
        ...newTree[groupNode.id],
        children: [...newTree[groupNode.id].children, id]
      };
    });

    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
      selectedNodeIds: [groupNode.id],
      selectedNodeId: groupNode.id,
    }));
  },

  clearCanvas: () => {
    const { rootId } = get();
    const newTree = createInitialTree();
    
    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
      selectedNodeIds: [],
      selectedNodeId: null,
    }));
  },

  moveNodeUp: (nodeId: string) => {
    const { canvasTree } = get();
    const newTree = moveNode(canvasTree, nodeId, "up");
    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
    }));
  },

  moveNodeDown: (nodeId: string) => {
    const { canvasTree } = get();
    const newTree = moveNode(canvasTree, nodeId, "down");
    set((state) => ({
      canvasTree: newTree,
      historyPast: pushHistory(state.historyPast, state.canvasTree),
      historyFuture: [],
    }));
  },

  undo: () => {
    const { historyPast, canvasTree } = get();
    if (historyPast.length === 0) return;

    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);

    set({
      canvasTree: previous,
      historyPast: newPast,
      historyFuture: [canvasTree, ...get().historyFuture],
    });
  },

  redo: () => {
    const { historyFuture, canvasTree } = get();
    if (historyFuture.length === 0) return;

    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);

    set({
      canvasTree: next,
      historyPast: pushHistory(get().historyPast, canvasTree),
      historyFuture: newFuture,
    });
  },

  save: () => {
    const { canvasTree, rootId } = get();
    console.log("Saving Canvas Node Tree:", {
      rootId,
      nodes: canvasTree,
    });
    console.info("Canvas saved. Open the browser console to inspect the tree.");
  },

  clearSelection: () => {
    set({ selectedNodeId: null, selectedNodeIds: [] });
  },
}));
