import { describe, expect, it, vi } from 'vitest';
import { getNewNodePosition } from './placement';

describe('node placement', () => {
  it('projects the canvas center through the ReactFlow viewport', () => {
    const project = vi.fn(({ x, y }) => ({ x: x / 2, y: y / 2 }));
    const position = getNewNodePosition(
      { left: 20, top: 40, width: 800, height: 500 },
      project,
    );

    expect(project).toHaveBeenCalledWith({ x: 420, y: 240 });
    expect(position).toEqual({ x: 210, y: 120 });
  });

  it('uses a bounded random fallback without canvas bounds', () => {
    const random = vi.fn().mockReturnValueOnce(0.25).mockReturnValueOnce(0.75);
    expect(getNewNodePosition(undefined, vi.fn(), random)).toEqual({ x: 125, y: 175 });
  });
});
