import { useEffect } from 'react';

interface FlowchartShortcutsOptions {
  addNode: () => void;
  deleteSelectedNodes: () => void;
  isClearDialogOpen: boolean;
  isHelpDialogOpen: boolean;
  closeClearDialog: () => void;
  closeHelpDialog: () => void;
}

type ShortcutAction =
  | 'add-node'
  | 'delete-selection'
  | 'close-clear-dialog'
  | 'close-help-dialog';

export const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
};

const isAddShortcut = (event: KeyboardEvent) =>
  (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n';

const isDeleteShortcut = (event: KeyboardEvent) =>
  event.key === 'Delete' || event.key === 'Backspace';

export const getShortcutAction = (
  event: KeyboardEvent,
  isClearDialogOpen: boolean,
  isHelpDialogOpen: boolean,
): ShortcutAction | null => {
  if (event.key === 'Escape' && isClearDialogOpen) return 'close-clear-dialog';
  if (event.key === 'Escape' && isHelpDialogOpen) return 'close-help-dialog';
  if (isClearDialogOpen || isHelpDialogOpen || isEditableTarget(event.target)) return null;
  if (isAddShortcut(event)) return 'add-node';
  if (isDeleteShortcut(event)) return 'delete-selection';
  return null;
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
      const action = getShortcutAction(
        event,
        isClearDialogOpen,
        isHelpDialogOpen,
      );
      if (!action) return;

      event.preventDefault();
      if (action === 'add-node') addNode();
      if (action === 'delete-selection') deleteSelectedNodes();
      if (action === 'close-clear-dialog') closeClearDialog();
      if (action === 'close-help-dialog') closeHelpDialog();
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
