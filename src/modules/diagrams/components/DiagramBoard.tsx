import { ReactFlow, Controls, MiniMap, Background, SelectionMode } from '@xyflow/react';
import { useParams } from 'react-router-dom';
import { useDiagramFlow } from '../hooks/useDiagramFlow';
import { useMapaMental } from '../hooks/useMapaMental';
import { DiagramHeaderPanel } from './panels/DiagramHeaderPanel';
import { DiagramHistoryPanel } from './panels/DiagramHistoryPanel';
import { NodeInputText } from './nodes/NodeInputText';
import { NodeMapaMental } from './nodes/NodeMapaMental';
import { EdgeInputText } from './edges/EdgeInputText';
import { useTheme } from '../../../commons/context/ThemeContext';

const nodeTypes = {
    nodeInputText: NodeInputText,
    nodeMapaMental: NodeMapaMental
};
const edgeTypes = { edgeInputText: EdgeInputText };
const panOnDrag = [1, 2];

export const DiagramBoard = () => {
    const { isDark } = useTheme();
    const { id } = useParams<{ id: string }>();
    const isMentalMap = id === '1';

    // Call both hooks to comply with React Rules of Hooks, passing active flag
    const defaultFlow = useDiagramFlow(!isMentalMap);
    const mentalMapFlow = useMapaMental(isMentalMap);

    const activeFlow = isMentalMap ? mentalMapFlow : defaultFlow;

    const handleDownloadMd = () => {
        if (!isMentalMap) return;
        const blob = new Blob([mentalMapFlow.markdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'mapa_mental.md');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="w-full h-full flex gap-4">
            {/* Markdown Editor Panel (on the left) */}
            {isMentalMap && mentalMapFlow.isMdPanelOpen && (
                <div className="w-[380px] flex-shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Editor Markdown
                        </h2>
                        <button
                            onClick={() => mentalMapFlow.setIsMdPanelOpen(false)}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 cursor-pointer"
                            title="Ocultar editor"
                        >
                            ◀
                        </button>
                    </div>
                    <textarea
                        value={mentalMapFlow.markdown}
                        onChange={(e) => mentalMapFlow.updateFromMarkdown(e.target.value)}
                        className="flex-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 font-mono focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500 resize-none"
                        placeholder="# Desarrollo&#10;## Tarea 1&#10;### Tarea 1.1..."
                    />
                    <button
                        onClick={handleDownloadMd}
                        className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition cursor-pointer text-sm"
                    >
                        Descargar en .md
                    </button>
                </div>
            )}

            <div className="flex-1 h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900 relative">
                <ReactFlow
                    nodes={activeFlow.nodes}
                    nodeTypes={nodeTypes}
                    edges={activeFlow.edges}
                    edgeTypes={edgeTypes}
                    onNodesChange={activeFlow.onNodesChange}
                    onEdgesChange={activeFlow.onEdgesChange}
                    onConnect={activeFlow.onConnect}
                    fitView
                    onEdgesDelete={activeFlow.onEdgesDelete}
                    deleteKeyCode={['Backspace', 'Delete']}
                    selectionOnDrag
                    panOnDrag={panOnDrag}
                    selectionMode={SelectionMode.Partial}
                    onPaneClick={isMentalMap ? undefined : (defaultFlow as any).onPaneClick}
                    onConnectEnd={activeFlow.onConnectEnd}
                    colorMode={isDark ? 'dark' : 'light'}
                >
                    <DiagramHeaderPanel
                        isAddingNode={isMentalMap ? false : defaultFlow.isAddingNode}
                        setIsAddingNode={isMentalMap ? () => { } : defaultFlow.setIsAddingNode}
                        expanded={isMentalMap ? false : defaultFlow.expanded}
                        setExpanded={isMentalMap ? (() => { }) as any : defaultFlow.setExpanded}
                        showCloseAll={isMentalMap}
                        onCloseAll={isMentalMap ? (mentalMapFlow as any).onCloseAll : undefined}
                        showEditorToggle={isMentalMap}
                        isEditorOpen={isMentalMap ? mentalMapFlow.isMdPanelOpen : false}
                        onToggleEditor={isMentalMap ? () => mentalMapFlow.setIsMdPanelOpen(!mentalMapFlow.isMdPanelOpen) : undefined}
                        title={isMentalMap ? 'Mapa Mental APV-123' : 'Diagrama'}
                    />
                    <DiagramHistoryPanel undo={activeFlow.undo} redo={activeFlow.redo} />
                    <Controls />
                    <MiniMap />
                    <Background />
                </ReactFlow>
            </div>
        </section>
    );
};

