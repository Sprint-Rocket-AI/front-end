import { Link } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '../assets/Icons';
import { useEffect } from 'react';
import { setDiagrams } from '../store/slices/diagramsSlice';
import { diagramService } from '../services/DiagramService';
import { ConfirmModal } from '../commons/components/ConfirmModal';
import { LoadingSpinner } from '../commons/components/LoadingSpinner';
import { CreateDiagramModal } from '../modules/diagrams/components/panels/CreateDiagramModal';
import { useDiagramsListPage } from '../modules/diagrams/hooks/useDiagramsListPage';

export const DiagramsListPage = () => {
    const {
        diagrams,
        loading,
        setLoading,
        diagramToDelete,
        setDiagramToDelete,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleCreateDiagram,
        handleDeleteDiagram,
        dispatch
    } = useDiagramsListPage();

    // Carga inicial de diagramas
    useEffect(() => {
        diagramService.getDiagrams()
            .then((data) => {
                dispatch(setDiagrams(data));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching diagrams", err);
                setLoading(false);
            });
    }, [dispatch, setLoading]);

    return (
        <div className="mx-auto w-full max-w-[1280px] animate-fade-in px-4">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">Sprint Rocket.AI — Diagramas</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Diagramas</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Explora y gestiona tus diagramas de arquitectura y flujo.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-md shadow-orange-500/10 cursor-pointer self-start sm:self-center gap-1.5"
                >
                    <PlusIcon size={16} />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <LoadingSpinner />
                </div>
            ) : diagrams.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {diagrams.map((diagram) => (
                        <div
                            key={diagram.id}
                            className="panel panel-interactive flex flex-col justify-between !rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                                        {diagram.title}
                                    </h2>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                        diagram.type === 'mental_map'
                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400'
                                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400'
                                    }`}>
                                        {diagram.type === 'mental_map' ? 'Mental' : 'Flujo'}
                                    </span>
                                </div>
                                <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                    {diagram.description || "Sin descripción."}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                    {new Date(diagram.updatedAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setDiagramToDelete(diagram.id)}
                                        className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Eliminar diagrama"
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                    <Link
                                        to={`/diagram/${diagram.id}`}
                                        className="inline-flex items-center justify-center rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/20 transition"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No tienes diagramas guardados.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition cursor-pointer"
                    >
                        Crear Primer Diagrama
                    </button>
                </div>
            )}

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
        </div>
    );
};
