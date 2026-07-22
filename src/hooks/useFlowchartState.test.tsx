import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { ReactFlowProvider } from 'reactflow';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFlowchartState } from './useFlowchartState';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ReactFlowProvider>{children}</ReactFlowProvider>
);

describe('useFlowchartState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('creates a new node with default editable flowchart data', () => {
    const { result } = renderHook(() => useFlowchartState([], [], 'Taskmapper'), {
      wrapper,
    });

    act(() => {
      result.current.addNode();
    });

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].type).toBe('customNode');
    expect(result.current.nodes[0].data.label).toBe('');
    expect(result.current.nodes[0].data.completed).toBe(false);
    expect(result.current.nodes[0].data.width).toBe(160);
    expect(result.current.nodes[0].data.height).toBe(80);
  });

  it('persists nodes without runtime callback fields', () => {
    const { result } = renderHook(() => useFlowchartState([], [], 'Taskmapper'), {
      wrapper,
    });

    act(() => {
      result.current.addNode();
    });

    const saved = JSON.parse(localStorage.getItem('flowchart-nodes') ?? '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].data.onLabelChange).toBeUndefined();
    expect(saved[0].data.onResize).toBeUndefined();
    expect(saved[0].data.onToggleComplete).toBeUndefined();
  });
});
