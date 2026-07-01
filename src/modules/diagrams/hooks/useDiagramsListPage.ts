import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { addDiagram, deleteDiagramState } from '../../../store/slices/diagramsSlice';
import { diagramService } from '../../../services/DiagramService';

export const useDiagramsListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const diagrams = useAppSelector((state) => state.diagrams.diagrams);
    const [loading, setLoading] = useState(true);
    const [diagramToDelete, setDiagramToDelete] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateDiagram = async (title: string, type: 'mental_map' | 'flow', description: string) => {
        try {
            const newDiag = await diagramService.createDiagram(title, type, description);
            dispatch(addDiagram(newDiag));
            navigate(`/diagram/${newDiag.id}`);
        } catch (error) {
            console.error("Error creating diagram", error);
        }
    };

    const handleDeleteDiagram = async () => {
        if (!diagramToDelete) return;
        try {
            await diagramService.deleteDiagram(diagramToDelete);
            dispatch(deleteDiagramState(diagramToDelete));
            setDiagramToDelete(null);
        } catch (error) {
            console.error("Error deleting diagram", error);
        }
    };

    return {
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
    };
};
