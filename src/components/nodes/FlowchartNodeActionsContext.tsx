import React, { createContext, useContext } from 'react';

interface FlowchartNodeActions {
  onLabelChange: (nodeId: string, newLabel: string) => void;
  onResize: (nodeId: string, width: number, height: number) => void;
  onToggleComplete: (nodeId: string, completed: boolean) => void;
}

const FlowchartNodeActionsContext = createContext<FlowchartNodeActions | null>(null);

interface FlowchartNodeActionsProviderProps {
  children: React.ReactNode;
  value: FlowchartNodeActions;
}

export const FlowchartNodeActionsProvider: React.FC<FlowchartNodeActionsProviderProps> = ({
  children,
  value,
}) => (
  <FlowchartNodeActionsContext.Provider value={value}>
    {children}
  </FlowchartNodeActionsContext.Provider>
);

export const useFlowchartNodeActions = (): FlowchartNodeActions => {
  const context = useContext(FlowchartNodeActionsContext);

  if (!context) {
    throw new Error('useFlowchartNodeActions must be used within FlowchartNodeActionsProvider');
  }

  return context;
};
