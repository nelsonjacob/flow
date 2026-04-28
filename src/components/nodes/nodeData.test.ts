import { describe, expect, it } from 'vitest';
import { createDefaultNodeData, mergeNodeData } from './nodeData';

describe('nodeData helpers', () => {
  it('creates default serializable node data', () => {
    expect(createDefaultNodeData()).toEqual({
      label: '',
      completed: false,
      width: 160,
      height: 80,
    });
  });

  it('merges persisted node data onto the default node shape', () => {
    expect(
      mergeNodeData({
        label: 'Saved task',
        completed: true,
        width: 220,
      }),
    ).toEqual({
      label: 'Saved task',
      completed: true,
      width: 220,
      height: 80,
    });
  });
});
