import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  clampDimensions,
  getContentDimensions,
  type DimensionConstraints,
  type Dimensions,
} from '../flowchart/dimensions';
import { measureTextWidth } from '../utils/flowchart/textMeasurement';

interface NodeDimensionsOptions {
  defaultWidth: number;
  defaultHeight: number;
  bufferSpace: number;
  initialWidth?: number;
  initialHeight?: number;
  onResize?: (id: string, width: number, height: number) => void;
  maxWidth?: number;
  maxHeight?: number;
}

export const useNodeDimensions = (
  id: string,
  text: string,
  options: NodeDimensionsOptions,
) => {
  const {
    defaultWidth,
    defaultHeight,
    bufferSpace,
    initialWidth = defaultWidth,
    initialHeight = defaultHeight,
    onResize,
    maxWidth = 500,
    maxHeight = 400,
  } = options;
  const constraints: DimensionConstraints = useMemo(
    () => ({
      minWidth: defaultWidth,
      minHeight: defaultHeight,
      maxWidth,
      maxHeight,
    }),
    [defaultHeight, defaultWidth, maxHeight, maxWidth],
  );
  const initialDimensions = clampDimensions(
    { width: initialWidth, height: initialHeight },
    constraints,
  );
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [wasManuallyResized, setWasManuallyResized] = useState(false);
  const previousTextLength = useRef(text.length);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const next = clampDimensions(
      { width: initialWidth, height: initialHeight },
      constraints,
    );
    setDimensions((current) =>
      current.width === next.width && current.height === next.height
        ? current
        : next,
    );
  }, [constraints, initialHeight, initialWidth]);

  const commitDimensions = useCallback(
    (next: Dimensions) => {
      if (next.width === dimensions.width && next.height === dimensions.height) return;
      setDimensions(next);
      onResize?.(id, next.width, next.height);
    },
    [dimensions.height, dimensions.width, id, onResize],
  );

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const scrollPosition = textarea.scrollTop;
    textarea.style.height = 'auto';
    const measured = getContentDimensions(
      measureTextWidth(text),
      textarea.scrollHeight,
      bufferSpace,
      constraints,
    );
    const isDeleting = text.length < previousTextLength.current;
    const grew =
      measured.width > dimensions.width || measured.height > dimensions.height;
    const shrank =
      measured.width < dimensions.width || measured.height < dimensions.height;

    if ((isDeleting && shrank) || (!isDeleting && !wasManuallyResized && grew)) {
      commitDimensions(measured);
    }
    if (isDeleting && text.length < 5) setWasManuallyResized(false);
    previousTextLength.current = text.length;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight - 24)}px`;
    textarea.scrollTop = textarea.scrollHeight > textarea.clientHeight ? scrollPosition : 0;
  }, [
    bufferSpace,
    commitDimensions,
    constraints,
    dimensions.height,
    dimensions.width,
    maxHeight,
    text,
    wasManuallyResized,
  ]);

  const handleManualResize = useCallback(
    (width: number, height: number) => {
      setWasManuallyResized(true);
      commitDimensions(clampDimensions({ width, height }, constraints));
    },
    [commitDimensions, constraints],
  );

  return {
    nodeWidth: dimensions.width,
    nodeHeight: dimensions.height,
    textareaRef,
    handleManualResize,
  };
};
