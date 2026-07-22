import { Handle, type HandleType, Position } from 'reactflow';
import type { HandleStyle } from '../../hooks/useHandleLogic';

const HANDLE_POSITIONS: { type: HandleType; position: Position; id: string }[] = [
  { type: 'source', position: Position.Top, id: 'top-center' },
  { type: 'source', position: Position.Right, id: 'right-center' },
  { type: 'source', position: Position.Bottom, id: 'bottom-center' },
  { type: 'source', position: Position.Left, id: 'left-center' },
];

interface NodeHandlesProps {
  nodeId: string;
  isConnectable: boolean;
  isEditing: boolean;
  getHandleStyle: (handleId: string) => HandleStyle;
  onMouseEnter: (handleId: string) => void;
  onMouseLeave: () => void;
  onMouseDown: (handleId: string) => void;
  onMouseUp: () => void;
}

export function NodeHandles({
  nodeId,
  isConnectable,
  isEditing,
  getHandleStyle,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: NodeHandlesProps) {
  return HANDLE_POSITIONS.map(({ type, position, id }) => {
    const handleId = `${nodeId}-${id}`;
    return (
      <Handle
        key={handleId}
        type={type}
        position={position}
        id={handleId}
        isConnectable={isConnectable && !isEditing}
        style={getHandleStyle(handleId)}
        onMouseEnter={() => onMouseEnter(handleId)}
        onMouseLeave={onMouseLeave}
        onMouseDown={() => onMouseDown(handleId)}
        onMouseUp={onMouseUp}
      />
    );
  });
}
