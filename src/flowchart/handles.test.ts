import { describe, expect, it } from 'vitest';
import { getConnectedHandleIds } from './handles';

describe('connected flowchart handles', () => {
  it('returns only handles connected to the requested node', () => {
    const connected = getConnectedHandleIds('node-a', [
      {
        id: 'edge-1',
        source: 'node-a',
        sourceHandle: 'node-a-right',
        target: 'node-b',
        targetHandle: 'node-b-left',
      },
      {
        id: 'edge-2',
        source: 'node-c',
        sourceHandle: 'node-c-right',
        target: 'node-a',
        targetHandle: 'node-a-left',
      },
    ]);

    expect([...connected]).toEqual(['node-a-right', 'node-a-left']);
  });
});
