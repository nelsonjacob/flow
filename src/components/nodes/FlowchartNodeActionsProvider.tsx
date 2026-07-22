import type { ReactNode } from 'react';
import {
  FlowchartNodeActionsContext,
  type FlowchartNodeActions,
} from './flowchartNodeActionsContext';

interface FlowchartNodeActionsProviderProps {
  children: ReactNode;
  value: FlowchartNodeActions;
}

export function FlowchartNodeActionsProvider({
  children,
  value,
}: FlowchartNodeActionsProviderProps) {
  return (
    <FlowchartNodeActionsContext.Provider value={value}>
      {children}
    </FlowchartNodeActionsContext.Provider>
  );
}
