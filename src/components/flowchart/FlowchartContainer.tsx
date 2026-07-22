import { useCallback, useMemo, useRef, useState } from 'react';
import ClearFlowchartModal from '../common/ClearFlowchartModal';
import ControlPanel from '../common/ControlPanel';
import EditableTitle from '../common/EditableTitle';
import Helpguide from '../common/Helpguide';
import TaskStats from '../common/TaskStats';
import { FlowchartNodeActionsProvider } from '../nodes/FlowchartNodeActionsProvider';
import { useFlowchartState } from '../../hooks/useFlowchartState';
import { useFlowchartShortcuts } from '../../hooks/useFlowchartShortcuts';
import FlowchartEditor from './FlowchartEditor';

interface FlowchartContainerProps {
  title?: string;
}

export const FlowchartContainer = ({ title: initialTitle }: FlowchartContainerProps) => {
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    title,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode: addFlowchartNode,
    clearChart,
    deleteSelectedNodes,
    updateTitle,
    onLabelChange,
    onNodeResize,
    onToggleComplete,
  } = useFlowchartState([], [], initialTitle);

  const addNode = useCallback(() => {
    addFlowchartNode(canvasRef.current?.getBoundingClientRect());
  }, [addFlowchartNode]);
  const closeClearDialog = useCallback(() => setShowClearConfirmation(false), []);
  const closeHelpDialog = useCallback(() => setShowHelpGuide(false), []);

  useFlowchartShortcuts({
    addNode,
    deleteSelectedNodes,
    isClearDialogOpen: showClearConfirmation,
    isHelpDialogOpen: showHelpGuide,
    closeClearDialog,
    closeHelpDialog,
  });

  const nodeActions = useMemo(
    () => ({
      onLabelChange,
      onResize: onNodeResize,
      onToggleComplete,
    }),
    [onLabelChange, onNodeResize, onToggleComplete],
  );
  const completedTasks = nodes.filter((node) => node.data.completed).length;

  const confirmClear = () => {
    clearChart();
    closeClearDialog();
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <FlowchartNodeActionsProvider value={nodeActions}>
          <div ref={canvasRef} className="h-full">
            <FlowchartEditor
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
            />
          </div>
          <ControlPanel
            onAddNode={addNode}
            onDeleteNode={deleteSelectedNodes}
            onClearChart={() => setShowClearConfirmation(true)}
            onHelpGuide={() => setShowHelpGuide(true)}
          />
          <div className="absolute left-5 top-5 z-10">
            <EditableTitle
              title={title}
              onTitleChange={updateTitle}
            />
          </div>
          <div className="absolute right-5 top-5 z-10">
            <TaskStats
              totalTasks={nodes.length}
              completedTasks={completedTasks}
            />
          </div>
        </FlowchartNodeActionsProvider>
      </div>

      <ClearFlowchartModal
        isOpen={showClearConfirmation}
        title={`Clear chart: ${title}?`}
        message="Are you sure you want to clear the entire chart?"
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={confirmClear}
        onCancel={closeClearDialog}
      />

      <Helpguide isOpen={showHelpGuide} onClose={closeHelpDialog} />
    </main>
  );
};

export default FlowchartContainer;
