import { describe, expect, it } from 'vitest';
import { clampDimensions, getContentDimensions } from './dimensions';

const constraints = {
  minWidth: 160,
  minHeight: 80,
  maxWidth: 400,
  maxHeight: 300,
};

describe('flowchart dimensions', () => {
  it('clamps dimensions to configured minimums and maximums', () => {
    expect(clampDimensions({ width: 20, height: 500 }, constraints)).toEqual({
      width: 160,
      height: 300,
    });
  });

  it('adds text padding before clamping measured content', () => {
    expect(getContentDimensions(180, 90, 60, constraints)).toEqual({
      width: 240,
      height: 114,
    });
  });
});
