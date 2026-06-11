import { ReactFlow, Controls, MiniMap, Background, SelectionMode } from '@xyflow/react';
import { useDiagramFlow } from '../hooks/useDiagramFlow';
import { DiagramHeaderPanel } from './panels/DiagramHeaderPanel';
import { DiagramHistoryPanel } from './panels/DiagramHistoryPanel';
import { NodeInputText } from './nodes/NodeInputText';
import { EdgeInputText } from './edges/EdgeInputText';
import { useTheme } from '../../../commons/context/ThemeContext';

const nodeTypes = { nodeInputText: NodeInputText };
const edgeTypes = { edgeInputText: EdgeInputText };
const panOnDrag = [1, 2];

export const DiagramBoard = () => {
    const { isDark } = useTheme();
    const {
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
    } = useDiagramFlow();

    return (
        <section className="w-full h-full">
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                    <DiagramHeaderPanel
                        isAddingNode={isAddingNode}
                        setIsAddingNode={setIsAddingNode}
                        expanded={expanded}
                        setExpanded={setExpanded}
                    />
                    <DiagramHistoryPanel undo={undo} redo={redo} />
                    <Controls />
                    <MiniMap />
                    <Background />
                </ReactFlow>
            </div>
        </section>
    );
};
