import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DiagramBoard } from '../modules/diagrams/components/DiagramBoard';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDiagrams } from './DiagramsListPage';

export const DiagramPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [pendingDiagramId, setPendingDiagramId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDiagramClick = (diagramId: string) => {
        if (diagramId === id) return;
        setPendingDiagramId(diagramId);
    };

    const confirmChange = () => {
        if (pendingDiagramId) {
            navigate(`/diagram/${pendingDiagramId}`);
            setPendingDiagramId(null);
        }
    };

    const filteredDiagrams = mockDiagrams.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex w-full h-[85vh] p-4 gap-4">
            {isSidebarOpen ? (
                <aside className="w-72 flex-shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hidden md:flex">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Otros Diagramas
                        </h2>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            title="Ocultar panel"
                        >
                            ◀
                        </button>
                    </div>

                    <input 
                        type="text" 
                        placeholder="Buscar por nombre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500"
                    />

                    <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                        {filteredDiagrams.length > 0 ? (
                            filteredDiagrams.map((diagram) => (
                                <button
                                    key={diagram.id}
                                    onClick={() => handleDiagramClick(diagram.id)}
                                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors ${
                                        id === diagram.id 
                                            ? 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' 
                                            : 'bg-slate-50 border-slate-200 hover:border-orange-300 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-orange-500/50'
                                    }`}
                                >
                                    <span className={`text-sm font-semibold ${id === diagram.id ? 'text-orange-700 dark:text-orange-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {diagram.title}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center mt-4">No se encontraron diagramas.</p>
                        )}
                    </div>
                </aside>
            ) : (
                <aside className="w-14 flex-shrink-0 flex flex-col items-center py-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hidden md:flex transition-all">
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                        title="Mostrar panel"
                    >
                        ▶
                    </button>
                </aside>
            )}
            
            <div className="flex-1 min-w-0 relative h-full">
                <ReactFlowProvider key={id}>
                    <DiagramBoard />
                </ReactFlowProvider>
            </div>

            {pendingDiagramId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm dark:bg-black/60">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Confirmar cambio de diagrama</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            ¿Estás seguro de que deseas cambiar de diagrama? Asegúrate de haber guardado tus cambios.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button 
                                onClick={() => setPendingDiagramId(null)}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmChange}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
                            >
                                Sí, cambiar diagrama
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};