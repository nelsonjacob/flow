import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFlowNode, type FlowchartSnapshot } from './model';
import { loadFlowchart, saveFlowchart, STORAGE_KEYS } from './persistence';

const fallback = (): FlowchartSnapshot => ({
  nodes: [createFlowNode('fallback', { x: 0, y: 0 })],
  edges: [],
  title: 'Fallback',
});

describe('flowchart persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('uses fallbacks for missing values', () => {
    expect(loadFlowchart(localStorage, fallback())).toEqual(fallback());
  });

  it('loads legacy data and fills missing node fields', () => {
    localStorage.setItem(
      STORAGE_KEYS.nodes,
      JSON.stringify([
        { id: 'saved', position: { x: 10, y: 20 }, data: { label: 'Saved' } },
      ]),
    );
    localStorage.setItem(STORAGE_KEYS.edges, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.title, JSON.stringify('Stored'));

    const result = loadFlowchart(localStorage, fallback());
    expect(result.title).toBe('Stored');
    expect(result.nodes[0].data).toEqual({
      label: 'Saved',
      completed: false,
      width: 160,
      height: 80,
    });
  });

  it('falls back when stored JSON is malformed', () => {
    localStorage.setItem(STORAGE_KEYS.nodes, '{not-json');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(loadFlowchart(localStorage, fallback())).toEqual(fallback());
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('drops invalid records and transient selection when saving', () => {
    const selectedNode = { ...createFlowNode('saved', { x: 1, y: 2 }), selected: true };
    saveFlowchart(localStorage, {
      nodes: [selectedNode],
      edges: [{ id: 'edge', source: 'saved', target: 'other', selected: true }],
      title: 'Saved chart',
    });

    const storedNodes = JSON.parse(localStorage.getItem(STORAGE_KEYS.nodes) ?? '[]');
    const storedEdges = JSON.parse(localStorage.getItem(STORAGE_KEYS.edges) ?? '[]');
    expect(storedNodes[0].selected).toBeUndefined();
    expect(storedEdges[0].selected).toBeUndefined();
    expect(localStorage.getItem(STORAGE_KEYS.title)).toBe('"Saved chart"');
  });
});
