import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFlowchartShortcuts } from './useFlowchartShortcuts';

const createOptions = () => ({
  addNode: vi.fn(),
  deleteSelectedNodes: vi.fn(),
  isClearDialogOpen: false,
  isHelpDialogOpen: false,
  closeClearDialog: vi.fn(),
  closeHelpDialog: vi.fn(),
});

describe('flowchart shortcuts', () => {
  it('supports platform add shortcuts and deletion keys', () => {
    const options = createOptions();
    renderHook(() => useFlowchartShortcuts(options));

    fireEvent.keyDown(window, { key: 'n', metaKey: true });
    fireEvent.keyDown(window, { key: 'Delete' });

    expect(options.addNode).toHaveBeenCalledOnce();
    expect(options.deleteSelectedNodes).toHaveBeenCalledOnce();
  });

  it('ignores graph shortcuts while editing text', () => {
    const options = createOptions();
    renderHook(() => useFlowchartShortcuts(options));
    const input = document.createElement('input');

    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(options.deleteSelectedNodes).not.toHaveBeenCalled();
  });

  it('closes the active dialog with Escape', () => {
    const options = { ...createOptions(), isClearDialogOpen: true };
    renderHook(() => useFlowchartShortcuts(options));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(options.closeClearDialog).toHaveBeenCalledOnce();
  });
});
