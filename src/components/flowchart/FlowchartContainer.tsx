import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import ControlPanel from './ControlPanel';
import EditableTitle from './EditableTitle';
import FlowchartEditor from './FlowchartEditor';
import { useFlowchartState } from './hooks/useFlowchartState';

interface FlowchartContainerProps {
  title?: string;
}

export const FlowchartContainer: React.FC<FlowchartContainerProps> = ({
  title: initialTitle
  }) => {
  const {
    nodes,
    edges,
    title,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteSelectedNodes,
    updateTitle,
  } = useFlowchartState([], [], initialTitle);

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
          <div className="absolute top-3 right-3 z-10">
            <EditableTitle 
              title={title} 
              onTitleChange={updateTitle}
            />
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowchartContainer;