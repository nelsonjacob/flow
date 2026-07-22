import { describe, expect, it } from 'vitest';
import { styleInteractiveEdges } from './useEdgeInteractions';

const edges = [{ id: 'edge-1', source: 'a', target: 'b' }];

describe('edge interaction styles', () => {
  it('preserves the edge array when nothing is active', () => {
    expect(styleInteractiveEdges(edges, null, null)).toBe(edges);
  });

  it('prioritizes the clicked style over the hovered style', () => {
    const [edge] = styleInteractiveEdges(edges, 'edge-1', 'edge-1');
    expect(edge.style).toMatchObject({ stroke: '#ef4444', strokeDasharray: '8,4' });
  });
});
