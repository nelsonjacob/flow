import { renderHook } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import type { Connection } from 'reactflow';

import { useConnectionConfig } from '../src/hooks/useConnectionConfig';

const connection = (source: string, target: string): Connection => ({
  source,
  target,
  sourceHandle: 'source-handle',
  targetHandle: 'target-handle',
});

describe('useConnectionConfig', () => {
  it('rejects self-connections', () => {
    const { result } = renderHook(() => useConnectionConfig());

    expect(result.current.isValidConnection(connection('node-a', 'node-a'))).toBe(false);
  });

  it('allows connections between distinct nodes regardless of handle type', () => {
    const { result } = renderHook(() => useConnectionConfig());

    expect(result.current.isValidConnection(connection('node-a', 'node-b'))).toBe(true);
  });
});
