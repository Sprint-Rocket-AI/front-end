import { useState, useCallback, useEffect } from 'react';
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    useReactFlow,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
    type Node
} from '@xyflow/react';

import { useHistory } from './useHistory';

const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'nodeInputText' },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, type: 'nodeInputText' },
];

const initialEdges = [
    { id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'edgeInputText', label: 'connects with' }
];

export const useDiagramFlow = (active = true) => {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [isAddingNode, setIsAddingNode] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { push: pushNodes, undo: undoNodes, redo: redoNodes } = useHistory(nodes, setNodes);
    const { push: pushEdges, undo: undoEdges, redo: redoEdges } = useHistory(edges, setEdges);

    const undo = useCallback(() => { undoNodes(); undoEdges(); }, [undoNodes, undoEdges]);
    const redo = useCallback(() => { redoNodes(); redoEdges(); }, [redoNodes, redoEdges]);

    useEffect(() => {
        if (!active) return;
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }
            if (!(e.ctrlKey || e.metaKey)) return;
            if (e.key === 'z') { e.preventDefault(); undo(); }
            if (e.key === 'y') { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo, active]);


    const { screenToFlowPosition } = useReactFlow();

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((params: Connection) => {
        pushEdges(addEdge({ ...params, type: 'edgeInputText', animated: false, label: '' }, edges));
    }, [edges, pushEdges]);

    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        setEdges((eds) =>
            eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id))
        );
    }, []);

    const onConnectEnd = useCallback((event: any, connectionState: any) => {
        if (!connectionState.isValid) {
            const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
            const position = screenToFlowPosition({ x: clientX, y: clientY });
            const id = `n${nodes.length + 1}`;
            pushNodes([...nodes, { id, position, data: { label: `Node ${nodes.length + 1}` }, type: 'nodeInputText' }]);
            pushEdges([...edges, { id: `e${edges.length + 1}`, source: connectionState.fromNode.id, target: id, type: 'edgeInputText', animated: false, label: '' }]);
        }
    }, [screenToFlowPosition, nodes, edges, pushNodes, pushEdges]);

    const onPaneClick = useCallback((event: React.MouseEvent) => {
        if (!isAddingNode) return;
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const id = `n${nodes.length + 1}`;
        pushNodes([...nodes, { id, position, data: { label: `Node ${nodes.length + 1}` }, type: 'nodeInputText' }]);
        setIsAddingNode(false);
    }, [isAddingNode, screenToFlowPosition, nodes, pushNodes]);

    return {
        nodes,
        edges,
        isAddingNode,
        setIsAddingNode,
        expanded,
        setExpanded,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onEdgesDelete,
        onConnectEnd,
        onPaneClick,
        undo,
        redo
    };
};
