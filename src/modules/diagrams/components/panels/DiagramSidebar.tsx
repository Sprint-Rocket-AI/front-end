import { useEffect } from 'react';
import { setDiagrams } from '../../../../store/slices/diagramsSlice';
import { diagramService } from '../../../../services/DiagramService';
import { ConfirmModal } from '../../../../commons/components/ConfirmModal';
import { CreateDiagramModal } from './CreateDiagramModal';
import { useDiagramSidebar } from '../../hooks/useDiagramSidebar';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '../../../../assets/Icons';

interface Props {
    currentId: string | undefined;
    onDiagramClick: (id: string) => void;
}

export const DiagramSidebar = ({ currentId, onDiagramClick }: Props) => {
    const {
        diagrams,
        isSidebarOpen,
        setIsSidebarOpen,
        searchTerm,
        setSearchTerm,
        diagramToDelete,
        setDiagramToDelete,
        isCreateModalOpen,
        setIsCreateModalOpen,
        filteredDiagrams,
        handleCreateDiagram,
        handleDeleteDiagram,
        dispatch
    } = useDiagramSidebar({ currentId });

    // Carga de diagramas si el listado está vacío
    useEffect(() => {
        if (diagrams.length === 0) {
            diagramService.getDiagrams().then(data => {
                dispatch(setDiagrams(data));
            }).catch(err => {
                console.error("Error loading diagrams inside sidebar", err);
            });
        }
    }, [dispatch, diagrams.length]);

    if (!isSidebarOpen) {
        return (
            <aside className="w-14 flex-shrink-0 flex flex-col items-center py-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hidden md:flex transition-all">
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 cursor-pointer"
                    title="Mostrar panel"
                >
                    <ChevronRightIcon size={16} />
                </button>
            </aside>
        );
    }

    return (
        <aside className="w-72 flex-shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hidden md:flex">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Otros Diagramas
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-lg p-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-0.5"
                        title="Crear diagrama"
                    >
                        <PlusIcon size={12} />
                    </button>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 cursor-pointer"
                        title="Ocultar panel"
                    >
                        <ChevronLeftIcon size={16} />
                    </button>
                </div>
            </div>

            <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500"
            />

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
                {filteredDiagrams.length > 0 ? (
                    filteredDiagrams.map((diagram) => (
                        <div
                            key={diagram.id}
                            className={`group relative flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                                currentId === diagram.id 
                                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' 
                                    : 'bg-slate-50 border-slate-200 hover:border-orange-300 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-orange-500/50'
                            }`}
                            onClick={() => onDiagramClick(diagram.id)}
                        >
                            <div className="flex flex-col min-w-0 pr-6">
                                <span className={`text-sm font-semibold truncate ${currentId === diagram.id ? 'text-orange-700 dark:text-orange-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {diagram.title}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                    {diagram.type === 'mental_map' ? 'Mapa Mental' : 'Flujo'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDiagramToDelete(diagram.id);
                                }}
                                className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                                title="Eliminar diagrama"
                            >
                                <TrashIcon size={14} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center mt-4">No se encontraron diagramas.</p>
                )}
            </div>

            <CreateDiagramModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateDiagram}
            />

            <ConfirmModal
                isOpen={diagramToDelete !== null}
                title="Eliminar Diagrama"
                message="¿Estás seguro de que deseas eliminar este diagrama? Esta acción borrará de forma permanente todos sus nodos y relaciones."
                confirmText="Eliminar"
                onConfirm={handleDeleteDiagram}
                onCancel={() => setDiagramToDelete(null)}
            />
        </aside>
    );
};
