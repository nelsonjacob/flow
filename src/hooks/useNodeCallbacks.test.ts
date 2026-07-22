import { describe, expect, it, vi } from 'vitest';
import type { Node } from 'reactflow';
import {
  updateNodeCompletion,
  updateNodeLabel,
  updateNodeSize,
} from './useNodeCallbacks';

const createNode = (overrides: Partial<Node> = {}): Node => ({
  id: 'node-1',
  type: 'customNode',
  position: { x: 0, y: 0 },
  data: { label: '', completed: false, width: 160, height: 80 },
  ...overrides,
});

describe('useNodeCallbacks helpers', () => {
  it('updates only the targeted node label', () => {
    const result = updateNodeLabel(
      [createNode(), createNode({ id: 'node-2' })],
      'node-1',
      'Renamed',
    );

    expect(result[0].data.label).toBe('Renamed');
    expect(result[1].data.label).toBe('');
  });

  it('updates size in both data and style for the targeted node', () => {
    const result = updateNodeSize([createNode()], 'node-1', 240, 140);

    expect(result[0].data.width).toBe(240);
    expect(result[0].data.height).toBe(140);
    expect(result[0].style).toMatchObject({ width: 240, height: 140 });
  });

  it('records completion timestamps only for the targeted node', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-27T12:00:00Z'));

    const result = updateNodeCompletion(
      [createNode(), createNode({ id: 'node-2' })],
      'node-1',
      true,
    );

    expect(result[0].data.completed).toBe(true);
    expect(result[0].data.completedAt).toBe(Date.parse('2026-04-27T12:00:00Z'));
    expect(result[1].data.completed).toBe(false);
    expect(result[1].data.completedAt).toBeUndefined();

    vi.useRealTimers();
  });
});
