export interface Dimensions {
  width: number;
  height: number;
}

export interface DimensionConstraints {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export const clampDimensions = (
  dimensions: Dimensions,
  constraints: DimensionConstraints,
): Dimensions => ({
  width: Math.min(
    Math.max(dimensions.width, constraints.minWidth),
    constraints.maxWidth,
  ),
  height: Math.min(
    Math.max(dimensions.height, constraints.minHeight),
    constraints.maxHeight,
  ),
});

export const getContentDimensions = (
  textWidth: number,
  scrollHeight: number,
  bufferSpace: number,
  constraints: DimensionConstraints,
) =>
  clampDimensions(
    { width: textWidth + bufferSpace, height: scrollHeight + 24 },
    constraints,
  );
