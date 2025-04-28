import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import MenuBar from './MenuBar';
import FlowchartEditor from './FlowchartEditor';
import { useFlowchartState } from './hooks/useFlowchartState';

interface FlowchartContainerProps {
  title?: string;
  // You could pass initialNodes and initialEdges here if needed
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MenuBar 
        title={title}
        onAddNode={addNode}
        onDeleteNode={deleteSelectedNodes}
      />
      <div className="flex-1 overflow-hidden">
        <ReactFlowProvider>
          <FlowchartEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowchartContainer;