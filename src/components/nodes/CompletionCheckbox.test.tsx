import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompletionCheckbox } from './CompletionCheckbox';

describe('CompletionCheckbox', () => {
  it('stays hidden until the node is visible or completed', () => {
    const { container } = render(
      <CompletionCheckbox
        completed={false}
        isNodeHovered={false}
        onToggleComplete={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('describes and invokes the completion action', () => {
    const onToggleComplete = vi.fn();
    render(
      <CompletionCheckbox
        completed={false}
        isNodeHovered
        onToggleComplete={onToggleComplete}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mark task complete' }));
    expect(onToggleComplete).toHaveBeenCalledOnce();
  });
});
