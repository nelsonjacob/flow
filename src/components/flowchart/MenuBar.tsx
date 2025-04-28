import React from 'react';
import Button from './Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MenuBarProps {
    title: string;
    onAddNode: () => void;
    onDeleteNode: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
    title, 
    onAddNode,
    onDeleteNode
}) => {
    return (
        <div className="bg-primary text-ui-text-light border-b border-primary-light shadow-menu flex justify-between items-center p-3 w-full">
          {/* Left side - Title and basic actions */}
          <div className="flex items-center">
            <h2 className="text-lg font-medium mr-6">{title}</h2>
            <div className="h-6 border-l border-primary-light mx-2"></div>
            <div className="flex items-center space-x-2">
              <Button 
                title="Add Node"
                onClick={onAddNode}
                className="px-3 py-1.5 bg-action text-white text-sm font-medium rounded-md hover:bg-action-hover transition-colors flex items-center"
                icon={<PlusIcon className="w-4 h-4 mr-1.5" />}
              />
              <Button 
                title="Delete"
                onClick={onDeleteNode}
                className="px-3 py-1.5 bg-ui text-ui-text-primary text-sm font-medium border border-ui-border rounded-md hover:bg-ui-secondary transition-colors flex items-center"
                icon={<TrashIcon className="w-4 h-4 mr-1.5" />}
              />
            </div>
          </div>
          
          {/* Right side - Additional actions */}
          <div className="flex items-center space-x-2">
          </div>
        </div>
    );
}

export default MenuBar;
    