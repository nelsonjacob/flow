import type { XYPosition } from 'reactflow';

export type CanvasBounds = Pick<DOMRect, 'height' | 'left' | 'top' | 'width'>;

export const getNewNodePosition = (
  bounds: CanvasBounds | undefined,
  screenToFlowPosition: (position: XYPosition) => XYPosition,
  random = Math.random,
): XYPosition => {
  if (!bounds) {
    return { x: 100 + random() * 100, y: 100 + random() * 100 };
  }

  return screenToFlowPosition({
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height * 0.4,
  });
};
