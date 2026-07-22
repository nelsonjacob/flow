import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClearFlowchartModal } from './ClearFlowchartModal';
import { ControlPanel } from './ControlPanel';
import { EditableTitle } from './EditableTitle';
import { FlowchartHelpDialog } from './FlowchartHelpDialog';
import { TaskStats } from './TaskStats';

describe('common flowchart controls', () => {
  it('edits and saves the flowchart title', () => {
    const onTitleChange = vi.fn();
    render(<EditableTitle title="Original" onTitleChange={onTitleChange} />);

    fireEvent.click(screen.getByRole('button', { name: /edit flowchart title/i }));
    const input = screen.getByRole('textbox', { name: 'Flowchart title' });
    fireEvent.change(input, { target: { value: 'Renamed' } });
    fireEvent.blur(input);

    expect(onTitleChange).toHaveBeenCalledWith('Renamed');
  });

  it('labels every icon-only control', () => {
    render(
      <ControlPanel
        onAddNode={vi.fn()}
        onDeleteNode={vi.fn()}
        onClearChart={vi.fn()}
        onHelpGuide={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Add task' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete selected tasks' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear chart' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open help' })).toBeInTheDocument();
  });

  it('exposes modal and progress semantics', () => {
    const { rerender } = render(
      <ClearFlowchartModal
        isOpen
        title="Clear chart?"
        message="This removes everything."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog', { name: 'Clear chart?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    rerender(<FlowchartHelpDialog isOpen onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Help Guide' })).toBeInTheDocument();

    rerender(<TaskStats totalTasks={4} completedTasks={3} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });
});
