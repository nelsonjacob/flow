import React, { useState } from 'react';
import ControlPanel from '../common/ControlPanel';
import EditableTitle from '../common/EditableTitle';
import TaskStats from '../common/TaskStats';
import FlowchartEditor from './FlowchartEditor';
import ClearFlowchartModal from '../common/ClearFlowchartModal';
import { useFlowchartState } from '../../hooks/useFlowchartState';

interface FlowchartContainerProps {
  title?: string;
}

export const FlowchartContainer: React.FC<FlowchartContainerProps> = ({
  title: initialTitle
}) => {
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  
  const {
    nodes,
    edges,
    title,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteSelectedNodes,
    clearChart,
    updateTitle,
  } = useFlowchartState([], [], initialTitle);

  const handleClearRequest = () => {
    setShowClearConfirmation(true);
  };

  const handleConfirmClear = () => {
    clearChart();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-hidden">
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
            onClearChart={handleClearRequest} // Changed to show confirmation first
          />
          <div className="absolute top-5 left-5 z-10">
            <EditableTitle 
              title={title} 
              onTitleChange={updateTitle}
            />
          </div>
          <div className="absolute top-5 right-5 z-10">
            <TaskStats 
              totalTasks={nodes.length} 
              completedTasks={nodes.filter(node => node.data.completed).length} 
            />
          </div>
      </div>
      <ClearFlowchartModal
        isOpen={showClearConfirmation}
        title={`Clear chart: ${title}?`}
        message={`Are you sure you want to clear the entire chart?`}
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
    </div>
  );
};

export default FlowchartContainer;