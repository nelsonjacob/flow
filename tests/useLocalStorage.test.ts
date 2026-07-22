import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLocalStorage } from '../src/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads stored JSON and falls back when a key is missing', () => {
    localStorage.setItem('stored-value', JSON.stringify({ name: 'Flow' }));

    const { result } = renderHook(() => useLocalStorage());

    expect(result.current.loadFromStorage('stored-value', { name: 'Default' })).toEqual({
      name: 'Flow',
    });
    expect(result.current.loadFromStorage('missing-value', ['default'])).toEqual(['default']);
  });

  it('falls back when stored JSON is malformed', () => {
    localStorage.setItem('broken-value', '{not-json');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useLocalStorage());

    expect(result.current.loadFromStorage('broken-value', 'fallback')).toBe('fallback');
    expect(consoleError).toHaveBeenCalledWith(
      'Error loading data from localStorage (broken-value):',
      expect.any(SyntaxError),
    );
  });

  it('serializes values when saving', () => {
    const { result } = renderHook(() => useLocalStorage());

    act(() => {
      result.current.saveToStorage('flow-value', { completed: true });
    });

    expect(localStorage.getItem('flow-value')).toBe('{"completed":true}');
  });
});
