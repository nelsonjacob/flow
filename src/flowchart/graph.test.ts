import { describe, expect, it } from 'vitest';
import type { Connection } from 'reactflow';
import {
  isValidConnection,
  removeSelectedElements,
  updateNodeCompletion,
  updateNodeLabel,
  updateNodeSize,
} from './graph';
import { createFlowNode, type FlowEdge, type FlowNode } from './model';

const node = (id: string, selected = false): FlowNode => ({
  ...createFlowNode(id, { x: 0, y: 0 }),
  selected,
});

const connection = (source: string, target: string): Connection => ({
  source,
  target,
  sourceHandle: 'source-handle',
  targetHandle: 'target-handle',
});

describe('flowchart graph operations', () => {
  it('rejects self-connections and accepts distinct nodes', () => {
    expect(isValidConnection(connection('node-a', 'node-a'))).toBe(false);
    expect(isValidConnection(connection('node-a', 'node-b'))).toBe(true);
  });

  it('updates only the targeted node label and size', () => {
    const nodes = [node('node-1'), node('node-2')];
    const labeled = updateNodeLabel(nodes, 'node-1', 'Renamed');
    const sized = updateNodeSize(labeled, 'node-1', 240, 140);

    expect(sized[0].data).toMatchObject({ label: 'Renamed', width: 240, height: 140 });
    expect(sized[0].style).toMatchObject({ width: 240, height: 140 });
    expect(sized[1]).toEqual(nodes[1]);
  });

  it('records and clears completion timestamps', () => {
    const completed = updateNodeCompletion([node('node-1')], 'node-1', true, 1234);
    expect(completed[0].data).toMatchObject({ completed: true, completedAt: 1234 });

    const reopened = updateNodeCompletion(completed, 'node-1', false, 5678);
    expect(reopened[0].data.completed).toBe(false);
    expect(reopened[0].data.completedAt).toBeUndefined();
  });

  it('removes selected nodes, selected edges, and connected edges', () => {
    const edges: FlowEdge[] = [
      { id: 'connected', source: 'selected', target: 'kept' },
      { id: 'selected-edge', source: 'kept', target: 'other', selected: true },
      { id: 'kept-edge', source: 'kept', target: 'other' },
    ];

    const result = removeSelectedElements(
      [node('selected', true), node('kept')],
      edges,
    );

    expect(result.nodes.map(({ id }) => id)).toEqual(['kept']);
    expect(result.edges.map(({ id }) => id)).toEqual(['kept-edge']);
  });
});
