import { useEffect } from 'react';

interface FlowchartShortcutsOptions {
  addNode: () => void;
  deleteSelectedNodes: () => void;
  isClearDialogOpen: boolean;
  isHelpDialogOpen: boolean;
  closeClearDialog: () => void;
  closeHelpDialog: () => void;
}

export const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
};

export const useFlowchartShortcuts = ({
  addNode,
  deleteSelectedNodes,
  isClearDialogOpen,
  isHelpDialogOpen,
  closeClearDialog,
  closeHelpDialog,
}: FlowchartShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isClearDialogOpen) {
          event.preventDefault();
          closeClearDialog();
        } else if (isHelpDialogOpen) {
          event.preventDefault();
          closeHelpDialog();
        }
        return;
      }

      if (isClearDialogOpen || isHelpDialogOpen || isEditableTarget(event.target)) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        addNode();
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelectedNodes();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    addNode,
    closeClearDialog,
    closeHelpDialog,
    deleteSelectedNodes,
    isClearDialogOpen,
    isHelpDialogOpen,
  ]);
};
