import { useCreateDiagramModal } from '../../hooks/useCreateDiagramModal';

interface CreateDiagramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, type: 'mental_map' | 'flow', description: string) => void;
}

export const CreateDiagramModal = ({ isOpen, onClose, onCreate }: CreateDiagramModalProps) => {
    const {
        title,
        setTitle,
        type,
        setType,
        description,
        setDescription,
        handleSubmit
    } = useCreateDiagramModal({ onCreate, onClose });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-scale-in text-slate-800 dark:text-slate-100">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Crear Nuevo Diagrama</h3>
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej. Flujo de Negocio APV"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tipo de Diagrama</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'mental_map' | 'flow')}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500"
                        >
                            <option value="flow">Diagrama de Flujo</option>
                            <option value="mental_map">Mapa Mental (Markdown)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Descripción</label>
                        <textarea
                            rows={3}
                            placeholder="Descripción corta del diagrama..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500 resize-none"
                        />
                    </div>
                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm cursor-pointer"
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
