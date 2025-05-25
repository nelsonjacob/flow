import { Connection, Edge } from 'reactflow';
import { AppNode } from '../../types/NodeTypes';

export interface NodeManager {


    getNodeDataById(id: string): AppNode | null;

    getParentNode(node: AppNode): AppNode | null;

    getChildNodes(node: AppNode): AppNode[];

    getSiblings(node: AppNode): AppNode[];

    getAncestors(node: AppNode): AppNode[];

    getDescendants(node: AppNode): AppNode[];

    getAllRelatedNodes(node: AppNode): AppNode[];

    getAllRelatedNodesByType(node: AppNode, type: string): AppNode[];

    getAllRelatedNodesByTypeAndLabel(node: AppNode, type: string, label: string): AppNode[];



    
}
