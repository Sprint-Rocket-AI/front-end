import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DiagramBoard } from '../modules/diagrams/components/DiagramBoard';
import { useNavigate, useParams } from 'react-router-dom';
import { DiagramSidebar } from '../modules/diagrams/components/panels/DiagramSidebar';

export const DiagramPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [pendingDiagramId, setPendingDiagramId] = useState<string | null>(null);

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

    return (
        <div className="flex w-full h-[85vh] p-4 gap-4">
            <DiagramSidebar currentId={id} onDiagramClick={handleDiagramClick} />
            
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