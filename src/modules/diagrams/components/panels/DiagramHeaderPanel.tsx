import { Panel } from '@xyflow/react';

interface Props {
    isAddingNode: boolean;
    setIsAddingNode: (val: boolean) => void;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    onCloseAll?: () => void;
    showCloseAll?: boolean;
    title?: string;
    showEditorToggle?: boolean;
    isEditorOpen?: boolean;
    onToggleEditor?: () => void;
    isAnyCollapsed?: boolean;
    showAddNode?: boolean;
}

export const DiagramHeaderPanel = ({
    setIsAddingNode,
    expanded,
    setExpanded,
    onCloseAll,
    showCloseAll = false,
    title = 'Mapa Mental APV-123',
    showEditorToggle = false,
    isEditorOpen = false,
    onToggleEditor,
    isAnyCollapsed = false,
    showAddNode = true
}: Props) => {
    return (
        <Panel position="top-left" className="bg-transparent shadow-none">
            <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>
                <div className="flex flex-col gap-2">
                    {/* Fila 1 */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setExpanded((prev) => !prev)}
                            className="px-3 py-1 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                            {expanded ? 'Ocultar detalle' : 'Ver detalle'}
                        </button>
                        {showAddNode && (
                            <button
                                onClick={() => setIsAddingNode(true)}
                                className="px-3 py-1 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                              >
                                  ➕ Nodo
                            </button>
                        )}
                    </div>

                    {/* Fila 2 */}
                    {(showEditorToggle || showCloseAll) && (
                        <div className="flex gap-2">
                            {showEditorToggle && onToggleEditor && (
                                <button
                                    onClick={onToggleEditor}
                                    className={`px-3 py-1 text-sm border rounded-md shadow transition cursor-pointer flex items-center gap-1 ${isEditorOpen
                                        ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    Editor
                                </button>
                            )}
                            {showCloseAll && onCloseAll && (
                                <button
                                    onClick={onCloseAll}
                                    className="px-3 py-1 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                                >
                                    {isAnyCollapsed ? 'Abrir todo' : 'Cerrar todo'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {expanded && (
                    <div className="bg-white dark:bg-neutral-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-neutral-700 shadow-md rounded-md p-4 w-[500px] max-w-[90vw]">
                        <p className="text-sm">
                            Este es un organizador de tareas y mapa mental interactivo. Permite ver la jerarquía y el estado de desarrollo de las tareas.
                            Puedes hacer doble clic en el tag del estado de cualquier tarea para cambiarlo de PENDIENTE, EN PROCESO o TERMINADO.
                            También puedes colapsar/expandir las tareas hijas haciendo clic en los botones redondos (+ / -) de los nodos.
                        </p>
                    </div>
                )}
            </div>
        </Panel>
    );
};

