import { SimpleNodeData, AppNode, AppNodeProps, NodeFactory } from '../NodeTypes';


const getRelatedNodeTree = (): AppNode[] => {
  const relatedNodes: AppNode[] = [];

  // Create related nodes using the builder
  const node1 = NodeFactory.createRelatedNode({
    id: 'root',
    label: 'Node 1',
    width: 100,
    height: 100,
    position: { x: 0, y: 0 },
    parentUuid: undefined,
    childrenUuids: ['childUuid', 'childUuid2'],
  });

  relatedNodes.push(node1);

  const node2 = NodeFactory.createRelatedNode({
    id: 'childUuid',
    label: 'Node 2',
    width: 100,
    height: 100,
    position: { x: 0, y: 0 },
    parentUuid: 'root',
    childrenUuids: [],
  });

  relatedNodes.push(node2);

  const node3 = NodeFactory.createRelatedNode({
    id: 'childUuid2',
    label: 'Node 3',
    width: 100,
    height: 100,
    position: { x: 0, y: 0 },
    parentUuid: 'root',
    childrenUuids: ['childUuid3']
  });
  relatedNodes.push(node3);

  const node4 = NodeFactory.createRelatedNode({
    id: 'childUuid3',
    label: 'Node 4',
    width: 100,
    height: 100,
    position: { x: 0, y: 0 },
    parentUuid: 'childUuid2',
    childrenUuids: [],
  });
  relatedNodes.push(node4);

  return relatedNodes;
}



describe('Create Simple Node', () => {
  let node: AppNode;

  beforeEach(() => {
    node = NodeFactory.createSimpleNode({
      id: '1',
      label: 'Test Node',
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
    });
  });
  test('createSimpleNode should create a node with correct properties', () => {
    expect(node).toHaveProperty('id', '1');
    expect(node).toHaveProperty('type', 'simpleNode');
    expect(node).toHaveProperty('position.x', 0);
    expect(node).toHaveProperty('position.y', 0);
    expect(node.data).toHaveProperty('label', 'Test Node');
    expect(node.data).toHaveProperty('width', 100);
    expect(node.data).toHaveProperty('height', 100);
  }
  );
});

describe('Create Related Node', () => {
  let node: AppNode;
  beforeEach(() => {
    node = NodeFactory.createRelatedNode({
      id: '1',
      label: 'Test Node',
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
      parentUuid: 'parentUuid',
      childrenUuids: ['childUuid', 'childUuid2'],
    });
  });

  test('createRelatedNode should create a node with correct properties', () => {
    expect(node).toHaveProperty('id', '1');
    expect(node).toHaveProperty('type', 'simpleNode');
    expect(node).toHaveProperty('position.x', 0);
    expect(node).toHaveProperty('position.y', 0);
    expect(node.data).toHaveProperty('label', 'Test Node');
    expect(node.data).toHaveProperty('width', 100);
    expect(node.data).toHaveProperty('height', 100);
    expect(node.data).toHaveProperty('parentUuid', 'parentUuid');
    expect(node.data).toHaveProperty('childrenUuids', ['childUuid', 'childUuid2']);
  });
});

describe('Extendable Node', () => {
  let node: AppNode;
  beforeEach(() => {
    node = NodeFactory.createSimpleNode({
      id: '1',
      label: 'Test Node',
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
    });

    node = NodeFactory.extendNode(node, {
      customField: 'customValue',
      customObject: { key: 'value' },
      customList: ['item1', 'item2']});

  });

  test('extendNode should add custom fields to the node', () => {
    expect(node.data).toHaveProperty('customField', 'customValue');
    expect(node.data).toHaveProperty('customObject.key', 'value');
    expect(node.data).toHaveProperty('customList', ['item1', 'item2']);
    expect(node.data).toHaveProperty('customList[0]', 'item1');
    expect(node.data).toHaveProperty('customList[1]', 'item2');
  });
  test('extendNode should not overwrite existing fields', () => {
    expect(node.data).toHaveProperty('label', 'Test Node');
    expect(node.data).toHaveProperty('width', 100);
    expect(node.data).toHaveProperty('height', 100);
  });
});


describe('Test node buildReferences', () => {
  let relatedNodes: AppNode[] = getRelatedNodeTree();

  test('expect that related nodes has 4 nodes', () => {
    expect(relatedNodes.length).toBe(4);
  });

  test()




});


