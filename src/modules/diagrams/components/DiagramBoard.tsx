import { useEffect, useCallback, useState, useRef } from 'react';
import { ReactFlow, Controls, MiniMap, Background, SelectionMode } from '@xyflow/react';
import { useParams } from 'react-router-dom';
import { useDiagramFlow } from '../hooks/useDiagramFlow';
import { useMapaMental } from '../hooks/useMapaMental';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDiagramBoard } from '../hooks/useDiagramBoard';
import { DiagramHeaderPanel } from './panels/DiagramHeaderPanel';
import { DiagramHistoryPanel } from './panels/DiagramHistoryPanel';
import { NodeInputText } from './nodes/NodeInputText';
import { NodeMapaMental } from './nodes/NodeMapaMental';
import { EdgeInputText } from './edges/EdgeInputText';
import { useTheme } from '../../../commons/context/ThemeContext';
import { diagramService } from '../../../services/DiagramService';
import { LoadingSpinner } from '../../../commons/components/LoadingSpinner';
import { ChevronLeftIcon } from '../../../assets/Icons';

const nodeTypes = {
    nodeInputText: NodeInputText,
    nodeMapaMental: NodeMapaMental
};
const edgeTypes = { edgeInputText: EdgeInputText };
const panOnDrag = [1, 2];

export const DiagramBoard = () => {
    const { isDark } = useTheme();
    const { id } = useParams<{ id: string }>();
    
    // Consumo del hook que maneja el estado del diagrama, guardado y renombrado
    const {
        activeDiagram,
        setActiveDiagram,
        loading,
        setLoading,
        expanded,
        setExpanded,
        handleSave,
        handleRename,
        handleDownloadMd
    } = useDiagramBoard({ id });

    const [fullscreenMode, setFullscreenMode] = useState<'none' | 'browser' | 'device'>('none');
    const containerRef = useRef<HTMLDivElement>(null);

    const isMentalMap = activeDiagram?.type === 'mental_map';

    // Invocación de hooks de flujo y mapa mental pasando los datos iniciales cargados
    const defaultFlow = useDiagramFlow(!isMentalMap && !loading, activeDiagram?.nodes, activeDiagram?.edges);
    const mentalMapFlow = useMapaMental(isMentalMap && !loading, activeDiagram?.markdown);

    const activeFlow = isMentalMap ? mentalMapFlow : defaultFlow;

    // Carga de diagrama por ID (Este useEffect queda en el componente)
    useEffect(() => {
        let isMounted = true;
        
        if (!id) return;

        diagramService.getDiagramById(id)
            .then((diagram) => {
                if (!isMounted) return;
                setActiveDiagram(diagram);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading diagram:", err);
                if (isMounted) setLoading(false);
            });
            
        return () => {
            isMounted = false;
        };
    }, [id, setActiveDiagram, setLoading]);

    // Escuchador de teclado para salir de pantalla completa del navegador mediante Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setFullscreenMode(prev => prev === 'browser' ? 'none' : prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Escuchador de cambio de pantalla completa nativa del dispositivo
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setFullscreenMode(prev => prev === 'device' ? 'none' : prev);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleBrowserFullscreen = () => {
        setFullscreenMode(prev => prev === 'browser' ? 'none' : 'browser');
    };

    const toggleDeviceFullscreen = async () => {
        if (!containerRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
                setFullscreenMode('device');
            } else {
                await document.exitFullscreen();
                setFullscreenMode('none');
            }
        } catch (err) {
            console.error("Error al alternar pantalla completa del dispositivo:", err);
        }
    };

    // Cálculo dinámico de cambios en la fase de renderizado
    const getIsDirty = () => {
        if (!activeDiagram || loading) return false;

        const currentNodesStr = JSON.stringify(activeFlow.nodes.map(n => {
            const d = n.data as Record<string, unknown>;
            return {
                id: n.id,
                position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
                data: { label: d.label, status: d.status, statusDetail: d.statusDetail, collapsed: d.collapsed }
            };
        }));
        const savedNodesStr = JSON.stringify(activeDiagram.nodes.map(n => {
            const d = n.data as Record<string, unknown>;
            return {
                id: n.id,
                position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
                data: { label: d.label, status: d.status, statusDetail: d.statusDetail, collapsed: d.collapsed }
            };
        }));
        const nodesChanged = currentNodesStr !== savedNodesStr;

        const currentEdgesStr = JSON.stringify(activeFlow.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label
        })));
        const savedEdgesStr = JSON.stringify(activeDiagram.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label
        })));
        const edgesChanged = currentEdgesStr !== savedEdgesStr;

        const markdownChanged = isMentalMap && mentalMapFlow.markdown !== activeDiagram.markdown;

        return nodesChanged || edgesChanged || markdownChanged;
    };

    const isDirty = getIsDirty();

    const onSave = useCallback(() => {
        return handleSave(activeFlow, isMentalMap);
    }, [handleSave, activeFlow, isMentalMap]);

    // Sincronización del auto-guardado (Este hook con efectos internos queda en el componente)
    const { saveStatus } = useAutoSave({
        id,
        isDirty,
        onSave,
        resetDirty: () => {},
        debounceMs: 3000
    });

    const handleDownload = () => {
        handleDownloadMd(mentalMapFlow.markdown);
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <LoadingSpinner />
            </div>
        );
    }

    if (!activeDiagram) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No se pudo cargar el diagrama.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Selecciona otro diagrama de la barra lateral o vuelve a la lista.</p>
            </div>
        );
    }

    return (
        <section 
            ref={containerRef}
            className={fullscreenMode !== 'none'
                ? "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 p-6 flex gap-4 w-screen h-screen"
                : "w-full h-full flex gap-4"
            }
        >
            {isMentalMap && mentalMapFlow.isMdPanelOpen && (
                <div className="w-[380px] flex-shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Editor Markdown
                        </h2>
                        <button
                            onClick={() => mentalMapFlow.setIsMdPanelOpen(false)}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-350 cursor-pointer flex items-center justify-center"
                            title="Ocultar editor"
                        >
                            <ChevronLeftIcon size={16} />
                        </button>
                    </div>
                    <textarea
                        value={mentalMapFlow.markdown}
                        onChange={(e) => mentalMapFlow.updateFromMarkdown(e.target.value)}
                        className="flex-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500 resize-none"
                        placeholder="# Desarrollo&#10;## Tarea 1&#10;### Tarea 1.1..."
                    />
                    <button
                        onClick={handleDownload}
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
                    onPaneClick={isMentalMap ? undefined : (e) => defaultFlow.onPaneClick(e as React.MouseEvent)}
                    onNodeDragStart={activeFlow.onNodeDragStart}
                    onConnectEnd={activeFlow.onConnectEnd}
                    onNodeDragStop={activeFlow.onNodeDragStop}
                    colorMode={isDark ? 'dark' : 'light'}
                >
                    <DiagramHeaderPanel
                        isAddingNode={isMentalMap ? false : defaultFlow.isAddingNode}
                        setIsAddingNode={isMentalMap ? () => { } : defaultFlow.setIsAddingNode}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        showCloseAll={isMentalMap}
                        onCloseAll={isMentalMap ? mentalMapFlow.onCloseAll : undefined}
                        isAnyCollapsed={isMentalMap ? mentalMapFlow.isAnyCollapsed : false}
                        showAddNode={!isMentalMap}
                        showEditorToggle={isMentalMap}
                        isEditorOpen={isMentalMap ? mentalMapFlow.isMdPanelOpen : false}
                        onToggleEditor={isMentalMap ? () => mentalMapFlow.setIsMdPanelOpen(!mentalMapFlow.isMdPanelOpen) : undefined}
                        title={activeDiagram.title}
                        description={activeDiagram.description}
                        onRename={handleRename}
                        saveStatus={saveStatus}
                        isBrowserFullscreen={fullscreenMode === 'browser'}
                        isDeviceFullscreen={fullscreenMode === 'device'}
                        onToggleBrowserFullscreen={toggleBrowserFullscreen}
                        onToggleDeviceFullscreen={toggleDeviceFullscreen}
                    />
                    <DiagramHistoryPanel undo={activeFlow.undo} redo={activeFlow.redo} canUndo={activeFlow.canUndo} canRedo={activeFlow.canRedo} />
                    <Controls />
                    <MiniMap />
                    <Background />
                </ReactFlow>
            </div>
        </section>
    );
};
