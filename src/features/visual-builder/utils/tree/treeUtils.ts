import type { CanvasNode, CanvasNodeId } from "../../types/canvas-node.types";
import { getComponentDefinition } from "../../registry/componentRegistry";

export const createNode = (
  componentKey: string,
  parentId: CanvasNodeId | null = null
): CanvasNode => {
  const definition = getComponentDefinition(componentKey);
  if (!definition) {
    throw new Error(`Component definition for ${componentKey} not found`);
  }

  return {
    id: `node-${Math.random().toString(36).substring(2, 11)}`,
    type: definition.category === "layout" ? "layout" : "component",
    componentKey,
    parentId,
    children: [],
    props: { ...definition.defaultProps },
  };
};

export const findNodeById = (
  tree: Record<string, CanvasNode>,
  id: string
): CanvasNode | undefined => {
  return tree[id];
};

export const insertNode = (
  tree: Record<string, CanvasNode>,
  node: CanvasNode,
  parentId: CanvasNodeId
): Record<string, CanvasNode> => {
  const newTree = { ...tree };
  const parent = newTree[parentId];

  if (!parent) return tree;

  // Update parent's children
  newTree[parentId] = {
    ...parent,
    children: [...parent.children, node.id],
  };

  // Add the node itself
  newTree[node.id] = { ...node, parentId };

  return newTree;
};

export const deleteNodeRecursive = (
  tree: Record<string, CanvasNode>,
  nodeId: string
): Record<string, CanvasNode> => {
  const newTree = { ...tree };
  const node = newTree[nodeId];
  if (!node) return tree;

  // Remove reference from parent
  if (node.parentId && newTree[node.parentId]) {
    newTree[node.parentId] = {
      ...newTree[node.parentId],
      children: newTree[node.parentId].children.filter((id) => id !== nodeId),
    };
  }

  // Recursive deletion of children
  const deleteChild = (id: string) => {
    const childNode = newTree[id];
    if (childNode) {
      childNode.children.forEach(deleteChild);
      delete newTree[id];
    }
  };

  node.children.forEach(deleteChild);
  delete newTree[nodeId];

  return newTree;
};

export const duplicateNodeRecursive = (
  tree: Record<string, CanvasNode>,
  nodeId: string,
  newParentId: string | null = null
): { tree: Record<string, CanvasNode>; newNodeId: string } => {
  const node = tree[nodeId];
  if (!node) return { tree, newNodeId: "" };

  const newNodeId = `node-${Math.random().toString(36).substring(2, 11)}`;
  const newNode: CanvasNode = {
    ...node,
    id: newNodeId,
    parentId: newParentId || node.parentId,
    children: [], // Will be populated below
  };

  let newTree = { ...tree, [newNodeId]: newNode };

  // Recursively duplicate children
  const newChildrenIds: string[] = [];
  node.children.forEach((childId) => {
    const result = duplicateNodeRecursive(newTree, childId, newNodeId);
    newTree = result.tree;
    newChildrenIds.push(result.newNodeId);
  });

  newTree[newNodeId].children = newChildrenIds;

  // If this was the top-level call, add to parent's children array
  if (!newParentId && node.parentId && newTree[node.parentId]) {
    const parent = newTree[node.parentId];
    const index = parent.children.indexOf(nodeId);
    const newSiblingChildren = [...parent.children];
    newSiblingChildren.splice(index + 1, 0, newNodeId);
    
    newTree[node.parentId] = {
      ...parent,
      children: newSiblingChildren,
    };
  }

  return { tree: newTree, newNodeId };
};

export const updateNodeProps = (
  tree: Record<string, CanvasNode>,
  nodeId: string,
  props: Record<string, any>
): Record<string, CanvasNode> => {
  const newTree = { ...tree };
  if (!newTree[nodeId]) return tree;

  newTree[nodeId] = {
    ...newTree[nodeId],
    props: {
      ...newTree[nodeId].props,
      ...props,
    },
  };

  return newTree;
};

export const moveNode = (
  tree: Record<string, CanvasNode>,
  nodeId: string,
  direction: "up" | "down"
): Record<string, CanvasNode> => {
  const newTree = { ...tree };
  const node = newTree[nodeId];
  if (!node || !node.parentId) return tree;

  const parent = newTree[node.parentId];
  const children = [...parent.children];
  const index = children.indexOf(nodeId);

  if (direction === "up" && index > 0) {
    [children[index], children[index - 1]] = [children[index - 1], children[index]];
  } else if (direction === "down" && index < children.length - 1) {
    [children[index], children[index + 1]] = [children[index + 1], children[index]];
  } else {
    return tree;
  }

  newTree[node.parentId] = {
    ...parent,
    children,
  };

  return newTree;
};
