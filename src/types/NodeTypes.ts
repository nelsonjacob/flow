import { Node as ReactFlowNode, NodeProps as ReactFlowNodeProps } from 'reactflow';

export interface SimpleNodeData {
    
    // Node specific data
    id: string;
    label: string;
    width?: number;
    height: number;
    isEditing?: boolean;


    // For the tree specific structure
    parentUuid?: string;
    childrenUuids?: string[];

    // Runtime only, never serialized
    _parent?: AppNode | null;
    _children?: AppNode[];
    
    // Extendable for inherited nodes
    [key: string]: any;
}

export interface AppNode extends ReactFlowNode<SimpleNodeData> {
    data: SimpleNodeData;
}

export interface AppNodeProps extends ReactFlowNodeProps<SimpleNodeData> {
    data: SimpleNodeData;
}

export class NodeFactory {
    // Create a node with fields able to passed to the node
    static createSimpleNode(options: 
        {
            id: string;
            label: string;
            width?: number;
            height: number;
            position: { x: number; y: number };
        }
    ): AppNode {
        return {
            id: options.id,
            type: 'simpleNode',
            position: options.position,   
            data: {
                id: options.id,
                label: options.label,
                width: options.width,
                height: options.height,
                position: options.position,
            }
        };
    }


    // Node with parent and children fields
    static createRelatedNode(options: {
        id: string;
        label: string;
        width?: number;
        height: number;
        position: { x: number; y: number };
        parentUuid: string | undefined;
        childrenUuids: string[];
    }): AppNode {
        const node = this.createSimpleNode(options);

        node.data.parentUuid = options.parentUuid;
        node.data.childrenUuids = options.childrenUuids;

        return node;
    }


    // Extend node with  additional fields
    static extendNode<T extends Record<string, any>>(
        node: AppNode,
        additionalFields: T
    ): AppNode & { data: SimpleNodeData & T } {
        return {
            ...node,
            data: {
                ...node.data,
                ...additionalFields,
            },
        } as AppNode & { data: SimpleNodeData & T };
    }


    static buildNodeReferences(nodes: AppNode[]): AppNode[] {

        const nodeMap = new Map<string, AppNode>();
        nodes.forEach(node => nodeMap.set(node.id, node)); 


        return nodes.map(node => {
            // Parent reference
            if (node.data.parentUuid) {
                node.data._parent = nodeMap.get(node.data.parentUuid) || null;
            } else {
                node.data._parent = null;
            }

            const childNodes: AppNode[] = [];
            if (node.data.childrenUuids && node.data.childrenUuids.length > 0) {
                node.data.childrenUuids.forEach(childId => {
                    const childNode = nodeMap.get(childId);
                    if (childNode) {
                        childNodes.push(childNode);
                    }
                });
            }
            node.data._children = childNodes;

            return node;
        });
    }
    
    // Prepare nodes for serialization by removing object references
    static prepareForSerialization(nodes: AppNode[]): AppNode[] {
        return nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                _parent: undefined,
                _children: undefined
            }
        }));
    }

};
