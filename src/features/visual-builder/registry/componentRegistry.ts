import type { ComponentDefinition } from "../types/component-definition.types";
import { registerBasicComponents } from "./registerBasicComponents";
import { registerLayoutComponents } from "./registerLayoutComponents";

export const componentRegistry: Record<string, ComponentDefinition> = {
  ...registerBasicComponents,
  ...registerLayoutComponents,
};

export const getComponentDefinition = (key: string): ComponentDefinition | undefined => {
  return componentRegistry[key];
};
