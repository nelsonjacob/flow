import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactFlowInstance } from 'reactflow';
import { useReactFlow } from 'reactflow';

import type { FlowEdge, FlowNode } from '../src/flowchart/model';
import { useFlowchartState } from '../src/hooks/useFlowchartState';

vi.mock('reactflow', async (importOriginal) => ({
  ...(await importOriginal<typeof import('reactflow')>()),
  useReactFlow: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: () => 'stable-id',
}));

const mockUseReactFlow = vi.mocked(useReactFlow);
const screenToFlowPosition = vi.fn(({ x, y }: { x: number; y: number }) => ({
  x: (x - 10) / 2,
  y: (y - 20) / 2,
}));

const node = (id: string, selected = false): FlowNode => ({
  id,
  type: 'customNode',
  data: { label: id, completed: false, width: 160, height: 80 },
  position: { x: 0, y: 0 },
  selected,
});

const edge = (
  id: string,
  source: string,
  target: string,
  selected = false,
): FlowEdge => ({ id, source, target, selected });

describe('useFlowchartState', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    mockUseReactFlow.mockReturnValue({ screenToFlowPosition } as unknown as ReactFlowInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes from storage instead of supplied defaults', () => {
    localStorage.setItem('flowchart-nodes', JSON.stringify([node('stored-node')]));
    localStorage.setItem('flowchart-edges', JSON.stringify([edge('stored-edge', 'a', 'b')]));
    localStorage.setItem('flowchart-title', JSON.stringify('Stored title'));

    const { result } = renderHook(() =>
      useFlowchartState([node('default-node')], [], 'Default title'),
    );

    expect(result.current.nodes.map(({ id }) => id)).toEqual(['stored-node']);
    expect(result.current.edges.map(({ id }) => id)).toEqual(['stored-edge']);
    expect(result.current.title).toBe('Stored title');
  });

  it('persists serializable node data, unselected edges, and title changes', () => {
    const callback = vi.fn();
    const initialNode = {
      ...node('node-a'),
      data: {
        ...node('node-a').data,
        label: 'Node A',
        onLabelChange: callback,
        onResize: callback,
        onToggleComplete: callback,
      },
    } as FlowNode;
    const initialEdge = edge('edge-a', 'node-a', 'node-b', true);

    const { result } = renderHook(() =>
      useFlowchartState([initialNode], [initialEdge], 'Initial title'),
    );

    const storedNodes = JSON.parse(localStorage.getItem('flowchart-nodes') ?? '[]');
    const storedEdges = JSON.parse(localStorage.getItem('flowchart-edges') ?? '[]');

    expect(storedNodes[0].data).toEqual({
      label: 'Node A',
      completed: false,
      width: 160,
      height: 80,
    });
    expect(storedEdges[0]).toMatchObject({ id: 'edge-a' });
    expect(storedEdges[0].selected).toBeUndefined();

    act(() => {
      result.current.updateTitle('Renamed flow');
    });

    expect(localStorage.getItem('flowchart-title')).toBe('"Renamed flow"');
  });

  it('rejects self-connections and creates styled edges for valid connections', () => {
    const { result } = renderHook(() => useFlowchartState());

    act(() => {
      result.current.onConnect({
        source: 'node-a',
        target: 'node-a',
        sourceHandle: null,
        targetHandle: null,
      });
    });
    expect(result.current.edges).toEqual([]);

    act(() => {
      result.current.onConnect({
        source: 'node-a',
        target: 'node-b',
        sourceHandle: 'right',
        targetHandle: 'left',
      });
    });

    expect(result.current.edges).toEqual([
      expect.objectContaining({
        id: 'edge-stable-id',
        source: 'node-a',
        target: 'node-b',
        animated: false,
        style: { stroke: '#555', strokeWidth: 2 },
      }),
    ]);
  });

  it('adds a default node at the viewport-adjusted canvas position', () => {
    const flowElement = document.createElement('div');
    flowElement.className = 'react-flow';
    flowElement.getBoundingClientRect = vi.fn(() => ({
      bottom: 500,
      height: 500,
      left: 0,
      right: 800,
      top: 0,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
    const { result } = renderHook(() => useFlowchartState());

    act(() => {
      result.current.addNode(flowElement.getBoundingClientRect());
    });

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0]).toMatchObject({
      id: 'stable-id',
      type: 'customNode',
      position: { x: 195, y: 90 },
      data: {
        label: '',
        completed: false,
        width: 160,
        height: 80,
      },
    });
    expect(result.current.nodes[0].data).toEqual({
      label: '',
      completed: false,
      width: 160,
      height: 80,
    });
    expect(result.current.onLabelChange).toEqual(expect.any(Function));
    expect(result.current.onNodeResize).toEqual(expect.any(Function));
  });

  it('uses the randomized fallback position when the canvas is unavailable', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.25).mockReturnValueOnce(0.75);
    const { result } = renderHook(() => useFlowchartState());

    act(() => {
      result.current.addNode();
    });

    expect(result.current.nodes[0].position).toEqual({ x: 125, y: 175 });
  });

  it('removes selected nodes, selected edges, and edges connected to deleted nodes', () => {
    const initialNodes = [node('selected-node', true), node('kept-node')];
    const initialEdges = [
      edge('connected-edge', 'selected-node', 'kept-node'),
      edge('selected-edge', 'kept-node', 'other-node', true),
      edge('kept-edge', 'kept-node', 'other-node'),
    ];
    const { result } = renderHook(() => useFlowchartState(initialNodes, initialEdges));

    act(() => {
      result.current.deleteSelectedNodes();
    });

    expect(result.current.nodes.map(({ id }) => id)).toEqual(['kept-node']);
    expect(result.current.edges.map(({ id }) => id)).toEqual(['kept-edge']);
  });

  it('clears the chart and resets the title in state and storage', () => {
    const { result } = renderHook(() =>
      useFlowchartState([node('node-a')], [edge('edge-a', 'node-a', 'node-b')], 'Named flow'),
    );

    act(() => {
      result.current.clearChart();
    });

    expect(result.current.nodes).toEqual([]);
    expect(result.current.edges).toEqual([]);
    expect(result.current.title).toBe('Flowchart');
    expect(localStorage.getItem('flowchart-nodes')).toBe('[]');
    expect(localStorage.getItem('flowchart-edges')).toBe('[]');
    expect(localStorage.getItem('flowchart-title')).toBe('"Flowchart"');
  });
});
