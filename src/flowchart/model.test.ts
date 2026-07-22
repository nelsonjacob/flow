import { describe, expect, it } from 'vitest';
import {
  createDefaultNodeData,
  createFlowNode,
  normalizeNodeData,
} from './model';

describe('flowchart model', () => {
  it('creates serializable default node data', () => {
    expect(createDefaultNodeData()).toEqual({
      label: '',
      completed: false,
      width: 160,
      height: 80,
    });
  });

  it('normalizes legacy and malformed node data', () => {
    expect(normalizeNodeData({ label: 'Saved task', completed: true, width: 220 })).toEqual({
      label: 'Saved task',
      completed: true,
      width: 220,
      height: 80,
    });
    expect(normalizeNodeData({ width: Number.NaN, height: 'large' })).toEqual(
      createDefaultNodeData(),
    );
  });

  it('creates a typed custom node at the requested position', () => {
    expect(createFlowNode('node-1', { x: 20, y: 40 })).toEqual({
      id: 'node-1',
      type: 'customNode',
      data: createDefaultNodeData(),
      position: { x: 20, y: 40 },
    });
  });
});
