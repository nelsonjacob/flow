import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NodeContent } from './NodeContent';

describe('NodeContent', () => {
  it('starts editing when the padded task body is double-clicked', () => {
    const onStartEditing = vi.fn();
    const { container } = render(
      <NodeContent
        isEditing={false}
        labelValue="Write tests"
        onLabelChange={vi.fn()}
        onBlur={vi.fn()}
        onKeyDown={vi.fn()}
        textareaRef={createRef<HTMLTextAreaElement>()}
        onStartEditing={onStartEditing}
      />,
    );

    fireEvent.doubleClick(container.firstElementChild as HTMLElement);

    expect(onStartEditing).toHaveBeenCalledOnce();
  });
});
