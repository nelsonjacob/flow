import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import ControlPanel from './ControlPanel';
import FlowchartEditor from './FlowchartEditor';
import { useFlowchartState } from './hooks/useFlowchartState';

interface FlowchartContainerProps {
  title?: string;
}

export const FlowchartContainer: React.FC<FlowchartContainerProps> = ({
  title = 'My Flowchart',
}) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteSelectedNodes,
  } = useFlowchartState();

  // Check if any nodes are selected
  const hasSelection = nodes.some(node => node.selected);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <FlowchartEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
          <ControlPanel
            onAddNode={addNode}
            onDeleteNode={deleteSelectedNodes}
            hasSelection={hasSelection}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowchartContainer;