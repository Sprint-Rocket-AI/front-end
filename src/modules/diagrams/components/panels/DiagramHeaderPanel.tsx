import { Panel } from '@xyflow/react';
import { useDiagramHeaderPanel } from '../../hooks/useDiagramHeaderPanel';

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
    onRename?: (newTitle: string) => void;
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
    description?: string;
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
    showAddNode = true,
    onRename,
    saveStatus = 'idle',
    description
}: Props) => {
    const {
        isEditingTitle,
        setIsEditingTitle,
        tempTitle,
        setTempTitle,
        handleSaveTitle,
        isCollapsed,
        setIsCollapsed
    } = useDiagramHeaderPanel({ title, onRename });

    const getStatusBadge = () => {
        switch (saveStatus) {
            case 'saving':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        Guardando...
                    </span>
                );
            case 'saved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Guardado
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                        Error al guardar
                    </span>
                );
            default:
                return null;
        }
    };

    // Si el panel está minimizado, renderizamos solo el botón del ojo en la esquina izquierda
    if (isCollapsed) {
        return (
            <Panel position="top-left" className="bg-transparent shadow-none">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-lg text-slate-500 hover:text-orange-500 hover:scale-105 transition-all cursor-pointer"
                    title="Mostrar panel de control"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
            </Panel>
        );
    }

    return (
        <Panel position="top-left" className="bg-transparent shadow-none">
            <div className="flex flex-col gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg transition-all duration-300 ease-in-out origin-left animate-scale-in">
                <div className="flex items-center justify-between gap-3 min-w-[280px] max-w-[450px]">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                                if (e.key === 'Escape') {
                                    setTempTitle(title);
                                    setIsEditingTitle(false);
                                }
                            }}
                            autoFocus
                            className="text-base font-bold text-slate-950 dark:text-slate-50 bg-slate-50 dark:bg-slate-800 border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 rounded-lg px-2 py-1 w-full"
                        />
                    ) : (
                        <div className="flex items-center gap-2 group cursor-pointer flex-1 min-w-0" onClick={() => setIsEditingTitle(true)}>
                            <h1 className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors truncate max-w-[220px]">
                                {title}
                            </h1>
                            <button
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-orange-500 transition-all cursor-pointer"
                                title="Editar nombre"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {getStatusBadge()}
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-350 transition cursor-pointer"
                            title="Ocultar panel"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {/* Fila 1 */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setExpanded((prev) => !prev)}
                            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                            {expanded ? 'Ocultar detalle' : 'Ver detalle'}
                        </button>
                        {showAddNode && (
                            <button
                                onClick={() => setIsAddingNode(true)}
                                className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
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
                                    className={`px-3 py-1.5 text-xs font-semibold border rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1 ${isEditorOpen
                                        ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    Editor
                                </button>
                            )}
                            {showCloseAll && onCloseAll && (
                                <button
                                    onClick={onCloseAll}
                                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                                >
                                    {isAnyCollapsed ? 'Abrir todo' : 'Cerrar todo'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {expanded && (
                    <div className="bg-white/95 dark:bg-slate-800/95 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-3.5 w-[360px] max-w-[90vw] text-xs leading-relaxed animate-fade-in">
                        {description && (
                            <div className="mb-3 pb-2.5 border-b border-slate-150 dark:border-slate-700/60 text-slate-800 dark:text-slate-200">
                                <h4 className="font-bold mb-1">Descripción:</h4>
                                <p className="italic text-slate-600 dark:text-slate-400">{description}</p>
                            </div>
                        )}
                        <p>
                            Este es un organizador de tareas y mapa mental interactivo. Permite ver la jerarquía y el estado de desarrollo de las tareas.
                        </p>
                        <p className="mt-2">
                            Puedes hacer doble clic en el tag del estado de cualquier tarea para cambiarlo entre <span className="font-semibold text-slate-800 dark:text-slate-200">PENDIENTE</span>, <span className="font-semibold text-orange-500">EN PROCESO</span> o <span className="font-semibold text-emerald-500">TERMINADO</span>.
                        </p>
                        <p className="mt-2">
                            También puedes colapsar/expandir las tareas hijas haciendo clic en los botones redondos (+ / -) de los nodos, u hacer doble clic en un texto para editarlo.
                        </p>
                    </div>
                )}
            </div>
        </Panel>
    );
};
