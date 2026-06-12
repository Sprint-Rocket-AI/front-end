import { useState } from 'react';
import { mockDiagrams } from '../../../../pages/DiagramsListPage';

interface Props {
    currentId: string | undefined;
    onDiagramClick: (id: string) => void;
}

export const DiagramSidebar = ({ currentId, onDiagramClick }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDiagrams = mockDiagrams.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isSidebarOpen) {
        return (
            <aside className="w-14 flex-shrink-0 flex flex-col items-center py-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hidden md:flex transition-all">
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    title="Mostrar panel"
                >
                    ▶
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
                            onClick={() => onDiagramClick(diagram.id)}
                            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors ${
                                currentId === diagram.id 
                                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' 
                                    : 'bg-slate-50 border-slate-200 hover:border-orange-300 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-orange-500/50'
                            }`}
                        >
                            <span className={`text-sm font-semibold ${currentId === diagram.id ? 'text-orange-700 dark:text-orange-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                {diagram.title}
                            </span>
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center mt-4">No se encontraron diagramas.</p>
                )}
            </div>
        </aside>
    );
};
