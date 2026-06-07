import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, MiniMap, Background, SelectionMode } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeInputText } from '../modules/diagrams/components/nodes/NodeInputText';
import { EdgeInputText } from '../modules/diagrams/components/edges/EdgeInputText';

const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'nodeInputText' },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, type: 'nodeInputText' },
];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'edgeInputText', label: 'connects with' }];
const nodeTypes = { nodeInputText: NodeInputText };
const edgedTypes = { edgeInputText: EdgeInputText }

export const DiagramPage = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    const onEdgesDelete = useCallback((edgesToDelete) => {
        setEdges((eds) => eds.filter((e) => !edgesToDelete.find((del) => del.id === e.id)));
    }, []);

    const onEdgeDoubleClick = useCallback((_, edge) => {
        setEdges((eds) =>
            eds.map((e) =>
                e.id === edge.id
                    ? { ...e, animated: !e.animated }
                    : e
            )
        );
    }, []);
    const panOnDrag = [1, 2];

    return (
        <section className="w-full h-screen">
            <section style={{ width: '100%', height: '80%' }}>
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    edges={edges}
                    edgeTypes={edgedTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    onEdgesDelete={onEdgesDelete}
                    deleteKeyCode={['Backspace', 'Delete']}
                    onEdgeDoubleClick={onEdgeDoubleClick}
                    selectionOnDrag
                    panOnDrag={panOnDrag}
                    selectionMode={SelectionMode.Partial}
                >
                    <Controls />
                    <MiniMap />

                    <Background />
                </ReactFlow>
            </section>

        </section>

    );
}