import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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

type FlowSnapshot = {
    nodes: Node[];
    edges: Edge[];
};

export const useDiagramFlow = (active = true, initialNodes?: Node[], initialEdges?: Edge[]) => {
    const [nodes, setNodes] = useState<Node[]>(initialNodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialEdges || []);
    const [isAddingNode, setIsAddingNode] = useState(false);

    const currentRef = useRef<FlowSnapshot>({
        nodes: initialNodes || [],
        edges: initialEdges || []
    });
    const historyRef = useRef<{ past: FlowSnapshot[]; future: FlowSnapshot[] }>({
        past: [],
        future: []
    });
    const dragStartSnapshotRef = useRef<FlowSnapshot | null>(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!active) {
            hasInitializedRef.current = false;
            return;
        }

        if (hasInitializedRef.current) return;

        const nextNodes = initialNodes || [];
        const nextEdges = initialEdges || [];

        currentRef.current = { nodes: nextNodes, edges: nextEdges };
        historyRef.current = { past: [], future: [] };
        setNodes(nextNodes);
        setEdges(nextEdges);
        setIsAddingNode(false);
        hasInitializedRef.current = true;
    }, [active, initialNodes, initialEdges]);

    const commitFlow = useCallback((nextNodes: Node[], nextEdges: Edge[]) => {
        historyRef.current.past.push(currentRef.current);
        historyRef.current.future = [];
        currentRef.current = { nodes: nextNodes, edges: nextEdges };
        setNodes(nextNodes);
        setEdges(nextEdges);
    }, []);

    const updateFlow = useCallback((nextNodes: Node[], nextEdges: Edge[]) => {
        currentRef.current = { nodes: nextNodes, edges: nextEdges };
        setNodes(nextNodes);
        setEdges(nextEdges);
    }, []);

    const undo = useCallback(() => {
        const { past, future } = historyRef.current;
        if (!past.length) return;

        const previous = past.pop()!;
        future.push(currentRef.current);
        updateFlow(previous.nodes, previous.edges);
    }, [updateFlow]);

    const redo = useCallback(() => {
        const { past, future } = historyRef.current;
        if (!future.length) return;

        const next = future.pop()!;
        past.push(currentRef.current);
        updateFlow(next.nodes, next.edges);
    }, [updateFlow]);

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

    const createNode = useCallback((position: { x: number; y: number }, sourceId?: string) => {
        const nextId = `n-${Date.now()}`;
        const nextNode = {
            id: nextId,
            position,
            data: { label: `Nodo ${currentRef.current.nodes.length + 1}` },
            type: 'nodeInputText'
        };

        const nextNodes = [...currentRef.current.nodes, nextNode];
        const nextEdges = sourceId
            ? [
                ...currentRef.current.edges,
                {
                    id: `e-${Date.now()}`,
                    source: sourceId,
                    target: nextId,
                    type: 'edgeInputText',
                    animated: false,
                    label: ''
                }
            ]
            : currentRef.current.edges;

        commitFlow(nextNodes, nextEdges);
    }, [commitFlow]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            const nextNodes = applyNodeChanges(changes, currentRef.current.nodes);
            updateFlow(nextNodes, currentRef.current.edges);
        },
        [updateFlow]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            const nextEdges = applyEdgeChanges(changes, currentRef.current.edges);
            updateFlow(currentRef.current.nodes, nextEdges);
        },
        [updateFlow]
    );

    const onConnect = useCallback((params: Connection) => {
        const nextEdges = addEdge({ ...params, type: 'edgeInputText', animated: false, label: '' }, currentRef.current.edges);
        commitFlow(currentRef.current.nodes, nextEdges);
    }, [commitFlow]);

    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        const nextEdges = currentRef.current.edges.filter((e) => !edgesToDelete.find((del) => del.id === e.id));
        commitFlow(currentRef.current.nodes, nextEdges);
    }, [commitFlow]);

    const onNodeDragStart = useCallback(() => {
        dragStartSnapshotRef.current = currentRef.current;
    }, []);

    const onNodeDragStop = useCallback(() => {
        if (!dragStartSnapshotRef.current) return;

        historyRef.current.past.push(dragStartSnapshotRef.current);
        historyRef.current.future = [];
        dragStartSnapshotRef.current = null;
    }, []);

    const onConnectEnd = useCallback((event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
        if (!connectionState.isValid && connectionState.fromNode) {
            const touchEvent = event as TouchEvent;
            const mouseEvent = event as MouseEvent;
            const clientX = 'changedTouches' in event ? touchEvent.changedTouches[0].clientX : mouseEvent.clientX;
            const clientY = 'changedTouches' in event ? touchEvent.changedTouches[0].clientY : mouseEvent.clientY;
            const position = screenToFlowPosition({ x: clientX, y: clientY });
            createNode(position, connectionState.fromNode.id);
        }
    }, [screenToFlowPosition, createNode]);

    const onPaneClick = useCallback((event: React.MouseEvent) => {
        if (!isAddingNode) return;
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        createNode(position);
        setIsAddingNode(false);
    }, [isAddingNode, screenToFlowPosition, createNode]);

    const onLabelChange = useCallback((id: string, newLabel: string) => {
        const updated = currentRef.current.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n);
        commitFlow(updated, currentRef.current.edges);
    }, [commitFlow]);

    const canUndo = historyRef.current.past.length > 0;
    const canRedo = historyRef.current.future.length > 0;

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
        onNodeDragStart,
        onConnectEnd,
        onNodeDragStop,
        onPaneClick,
        undo,
        redo,
        canUndo,
        canRedo
    };
};
