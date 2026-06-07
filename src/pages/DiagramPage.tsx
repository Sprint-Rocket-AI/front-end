import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Controls,
    MiniMap,
    Background,
    SelectionMode,
    Panel,
    useReactFlow
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { NodeInputText } from '../modules/diagrams/components/nodes/NodeInputText';
import { EdgeInputText } from '../modules/diagrams/components/edges/EdgeInputText';
import { useTheme } from '../commons/context/ThemeContext';
import { useHistory } from '../modules/diagrams/hooks/useHistory';

const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'nodeInputText' },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, type: 'nodeInputText' },
];

const initialEdges = [
    { id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'edgeInputText', label: 'connects with' }
];

const nodeTypes = { nodeInputText: NodeInputText };
const edgeTypes = { edgeInputText: EdgeInputText };


export const DiagramPage = () => {
    return (
        <ReactFlowProvider>
            <DiagramContent />
        </ReactFlowProvider>
    );
};

const DiagramContent = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [isAddingNode, setIsAddingNode] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { isDark } = useTheme();
    const { push: pushNodes, undo: undoNodes, redo: redoNodes } = useHistory(nodes, setNodes);
    const { push: pushEdges, undo: undoEdges, redo: redoEdges } = useHistory(edges, setEdges);

    const undo = useCallback(() => { undoNodes(); undoEdges(); }, [undoNodes, undoEdges]);
    const redo = useCallback(() => { redoNodes(); redoEdges(); }, [redoNodes, redoEdges]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            if (e.key === 'z') { e.preventDefault(); undo(); }
            if (e.key === 'y') { e.preventDefault(); redo(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);
    const { screenToFlowPosition } = useReactFlow();

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback((params) => {
        pushEdges(addEdge({ ...params, type: 'edgeInputText', animated: false, label: '' }, edges));
    }, [edges, pushEdges]);



    const onEdgesDelete = useCallback((edgesToDelete) => {
        setEdges((eds) =>
            eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id))
        );
    }, []);


    const panOnDrag = [1, 2];

    const onConnectEnd = useCallback((event, connectionState) => {
        if (!connectionState.isValid) {
            const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
            const position = screenToFlowPosition({ x: clientX, y: clientY });
            const id = `n${nodes.length + 1}`;
            pushNodes([...nodes, { id, position, data: { label: `Node ${nodes.length + 1}` }, type: 'nodeInputText' }]);
            pushEdges([...edges, { id: `e${edges.length + 1}`, source: connectionState.fromNode.id, target: id, type: 'edgeInputText', animated: false, label: '' }]);
        }
    }, [screenToFlowPosition, nodes, edges, pushNodes, pushEdges]);

    const onPaneClick = useCallback((event) => {
        if (!isAddingNode) return;
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const id = `n${nodes.length + 1}`;
        pushNodes([...nodes, { id, position, data: { label: `Node ${nodes.length + 1}` }, type: 'nodeInputText' }]);
        setIsAddingNode(false);
    }, [isAddingNode, screenToFlowPosition, nodes, pushNodes]);

    return (
        <section className={`w-full h-screen ${isAddingNode ? 'cursor-crosshair' : ''}`}>
            <section style={{ width: '100%', height: '80%' }}>
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    onEdgesDelete={onEdgesDelete}
                    deleteKeyCode={['Backspace', 'Delete']}
                    selectionOnDrag
                    panOnDrag={panOnDrag}
                    selectionMode={SelectionMode.Partial}
                    onPaneClick={onPaneClick}
                    onConnectEnd={onConnectEnd}
                    colorMode={isDark ? 'dark' : 'light'}
                >
                    <Panel position="top-left" className="bg-transparent shadow-none">
                        <div className="flex flex-col gap-2">

                            <h1 className="text-lg font-bold">Mapa Mental APV-123</h1>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddingNode(true)}
                                    className="px-3 py-1 text-sm border rounded-md shadow"
                                >
                                    ➕ Nodo
                                </button>

                                <button
                                    onClick={() => setExpanded((prev) => !prev)}
                                    className="px-3 py-1 text-sm border rounded-md shadow"
                                >
                                    {expanded ? 'Ocultar detalle' : 'Ver detalle'}
                                </button>
                            </div>

                            {expanded && (
                                <div className="bg-white text-black shadow-md rounded-md p-4 w-[500px] max-w-[90vw]">
                                    <p className="text-sm">
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit...
                                    </p>
                                </div>
                            )}
                        </div>
                    </Panel>

                    <Panel position="top-right">
                        <div className="flex gap-2">
                            <button onClick={undo} className="px-3 py-1 text-sm border rounded-md shadow">
                                ↩ Deshacer
                            </button>
                            <button onClick={redo} className="px-3 py-1 text-sm border rounded-md shadow">
                                ↪ Rehacer
                            </button>
                        </div>
                    </Panel>

                    <Controls />
                    <MiniMap />
                    <Background />
                </ReactFlow>
            </section>
        </section>
    );
};