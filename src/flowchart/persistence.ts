import type { FlowEdge, FlowNode, FlowchartSnapshot } from './model';
import { normalizeNodeData } from './model';

export const STORAGE_KEYS = {
  nodes: 'flowchart-nodes',
  edges: 'flowchart-edges',
  title: 'flowchart-title',
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isPosition = (value: unknown) =>
  isRecord(value) &&
  typeof value.x === 'number' &&
  Number.isFinite(value.x) &&
  typeof value.y === 'number' &&
  Number.isFinite(value.y);

const normalizeNode = (value: unknown): FlowNode | null => {
  if (!isRecord(value) || typeof value.id !== 'string' || !isPosition(value.position)) {
    return null;
  }

  const persisted = { ...value };
  delete persisted.selected;
  delete persisted.dragging;
  return {
    ...persisted,
    id: value.id,
    position: value.position,
    data: normalizeNodeData(value.data),
  } as FlowNode;
};

const normalizeEdge = (value: unknown): FlowEdge | null => {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.source !== 'string' ||
    typeof value.target !== 'string'
  ) {
    return null;
  }

  const persisted = { ...value };
  delete persisted.selected;
  return persisted as FlowEdge;
};

const readJson = (storage: Storage, key: string): unknown => {
  const storedValue = storage.getItem(key);
  return storedValue === null ? undefined : JSON.parse(storedValue);
};

const readNodes = (value: unknown, fallback: FlowNode[]) => {
  if (value === undefined) {
    return fallback.map((node) => ({
      ...node,
      data: normalizeNodeData(node.data),
    }));
  }
  if (!Array.isArray(value)) return fallback;
  return value.map(normalizeNode).filter((node): node is FlowNode => node !== null);
};

const readEdges = (value: unknown, fallback: FlowEdge[]) => {
  if (value === undefined) return fallback;
  if (!Array.isArray(value)) return fallback;
  return value.map(normalizeEdge).filter((edge): edge is FlowEdge => edge !== null);
};

export const loadFlowchart = (
  storage: Storage,
  fallback: FlowchartSnapshot,
): FlowchartSnapshot => {
  try {
    const title = readJson(storage, STORAGE_KEYS.title);
    return {
      nodes: readNodes(readJson(storage, STORAGE_KEYS.nodes), fallback.nodes),
      edges: readEdges(readJson(storage, STORAGE_KEYS.edges), fallback.edges),
      title: typeof title === 'string' ? title : fallback.title,
    };
  } catch (error) {
    console.error('Error loading flowchart from localStorage:', error);
    return fallback;
  }
};

const serializeNode = (node: FlowNode): FlowNode => {
  const persisted = { ...node };
  delete persisted.selected;
  delete persisted.dragging;
  return { ...persisted, data: normalizeNodeData(node.data) };
};

const serializeEdge = (edge: FlowEdge): FlowEdge => {
  const persisted = { ...edge };
  delete persisted.selected;
  return persisted;
};

export const saveFlowchart = (storage: Storage, snapshot: FlowchartSnapshot) => {
  try {
    storage.setItem(
      STORAGE_KEYS.nodes,
      JSON.stringify(snapshot.nodes.map(serializeNode)),
    );
    storage.setItem(
      STORAGE_KEYS.edges,
      JSON.stringify(snapshot.edges.map(serializeEdge)),
    );
    storage.setItem(STORAGE_KEYS.title, JSON.stringify(snapshot.title));
  } catch (error) {
    console.error('Error saving flowchart to localStorage:', error);
  }
};
