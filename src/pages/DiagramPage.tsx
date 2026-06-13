import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DiagramBoard } from '../modules/diagrams/components/DiagramBoard';
import { useNavigate, useParams } from 'react-router-dom';
import { DiagramSidebar } from '../modules/diagrams/components/panels/DiagramSidebar';
import { ConfirmModal } from '../commons/components/ConfirmModal';

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

            <ConfirmModal
                isOpen={!!pendingDiagramId}
                title="Confirmar cambio de diagrama"
                message="¿Estás seguro de que deseas cambiar de diagrama? Asegúrate de haber guardado tus cambios."
                confirmText="Sí, cambiar diagrama"
                onConfirm={confirmChange}
                onCancel={() => setPendingDiagramId(null)}
            />
        </div>
    );
};