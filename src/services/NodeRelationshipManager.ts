import { AppNode } from '../types/NodeTypes';


// Define an interface for this class
interface NodeRelationshipManager {
    getParentNode(node: AppNode): AppNode | null;
    getChildNodes(node: AppNode): AppNode[];
    getSiblings(node: AppNode): AppNode[];
    getAncestors(node: AppNode): AppNode[];
    getDescendants(node: AppNode): AppNode[];
    getAllRelatedNodes(node: AppNode): AppNode[];
    getAllRelatedNodesByType(node: AppNode, type: string): AppNode[];
    getAllRelatedNodesByLabel(node: AppNode, label: string): AppNode[];
    getAllRelatedNodesByTypeAndLabel(node: AppNode, type: string, label: string): AppNode[];
} 