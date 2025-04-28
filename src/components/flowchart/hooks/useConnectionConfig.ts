import { useCallback } from 'react';
import { Connection } from 'reactflow';

export const useConnectionConfig = () => {
  const isValidConnection = useCallback((connection: Connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) {
      return false;
    }
    
    // Allow connections between any handle types
    return true;
  }, []);

  return {
    isValidConnection,
  };
};