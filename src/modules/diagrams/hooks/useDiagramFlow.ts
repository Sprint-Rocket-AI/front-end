import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    useReactFlow,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
    type Node,
    type FinalConnectionState
} from '@xyflow/react';

import { useHistory } from './useHistory';

export const useDiagramFlow = (active = true, initialNodes?: Node[], initialEdges?: Edge[]) => {
    const [prevNodesProp, setPrevNodesProp] = useState<Node[] | undefined>(initialNodes);
    const [prevEdgesProp, setPrevEdgesProp] = useState<Edge[] | undefined>(initialEdges);
    const [nodes, setNodes] = useState<Node[]>(initialNodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialEdges || []);
    const [isAddingNode, setIsAddingNode] = useState(false);

    if (active && (prevNodesProp !== initialNodes || prevEdgesProp !== initialEdges)) {
        setPrevNodesProp(initialNodes);
        setPrevEdgesProp(initialEdges);
        setNodes(initialNodes || []);
        setEdges(initialEdges || []);
    }

    const { push: pushNodes, undo: undoNodes, redo: redoNodes } = useHistory(nodes, setNodes);
    const { push: pushEdges, undo: undoEdges, redo: redoEdges } = useHistory(edges, setEdges);

    const undo = useCallback(() => { 
        undoNodes(); 
        undoEdges(); 
    }, [undoNodes, undoEdges]);

    const redo = useCallback(() => { 
        redoNodes(); 
        redoEdges(); 
    }, [redoNodes, redoEdges]);

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
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
        },
        []
    );

    const onConnect = useCallback((params: Connection) => {
        const nextEdges = addEdge({ ...params, type: 'edgeInputText', animated: false, label: '' }, edges);
        pushEdges(nextEdges);
    }, [edges, pushEdges]);

    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        setEdges((eds) =>
            eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id))
        );
    }, []);

    const onConnectEnd = useCallback((event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
        if (!connectionState.isValid && connectionState.fromNode) {
            const touchEvent = event as TouchEvent;
            const mouseEvent = event as MouseEvent;
            const clientX = 'changedTouches' in event ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
            const clientY = 'changedTouches' in event ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;
            const position = screenToFlowPosition({ x: clientX, y: clientY });
            const id = `n-${Date.now()}`;
            
            const nextNodes = [...nodes, { id, position, data: { label: `Nodo ${nodes.length + 1}` }, type: 'nodeInputText' }];
            const nextEdges = [...edges, { id: `e-${Date.now()}`, source: connectionState.fromNode.id, target: id, type: 'edgeInputText', animated: false, label: '' }];
            
            pushNodes(nextNodes);
            pushEdges(nextEdges);
        }
    }, [screenToFlowPosition, nodes, edges, pushNodes, pushEdges]);

    const onPaneClick = useCallback((event: React.MouseEvent) => {
        if (!isAddingNode) return;
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const id = `n-${Date.now()}`;
        
        pushNodes([...nodes, { id, position, data: { label: `Nodo ${nodes.length + 1}` }, type: 'nodeInputText' }]);
        setIsAddingNode(false);
    }, [isAddingNode, screenToFlowPosition, nodes, pushNodes]);

    const onLabelChange = useCallback((id: string, newLabel: string) => {
        setNodes((nds) => {
            const updated = nds.map((n) => n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n);
            pushNodes(updated);
            return updated;
        });
    }, [pushNodes]);

    const nodeHandlers = useMemo(() => ({
        onLabelChange
    }), [onLabelChange]);

    const nodesWithHandlers = useMemo(() => {
        return nodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                ...nodeHandlers
            }
        }));
    }, [nodes, nodeHandlers]);

    return {
        nodes: nodesWithHandlers,
        edges,
        setNodes,
        setEdges,
        isAddingNode,
        setIsAddingNode,
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
