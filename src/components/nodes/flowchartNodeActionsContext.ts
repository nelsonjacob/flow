import { createContext } from 'react';

export interface FlowchartNodeActions {
  onLabelChange: (nodeId: string, newLabel: string) => void;
  onResize: (nodeId: string, width: number, height: number) => void;
  onToggleComplete: (nodeId: string, completed: boolean) => void;
}

export const FlowchartNodeActionsContext =
  createContext<FlowchartNodeActions | null>(null);
