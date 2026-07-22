import { useContext } from 'react';
import { FlowchartNodeActionsContext } from './flowchartNodeActionsContext';

export const useFlowchartNodeActions = () => {
  const context = useContext(FlowchartNodeActionsContext);

  if (!context) {
    throw new Error(
      'useFlowchartNodeActions must be used within FlowchartNodeActionsProvider',
    );
  }

  return context;
};
