import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { addDiagram, deleteDiagramState } from '../../../store/slices/diagramsSlice';
import { diagramService } from '../../../services/DiagramService';

interface UseDiagramSidebarProps {
    currentId: string | undefined;
}

export const useDiagramSidebar = ({ currentId }: UseDiagramSidebarProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const diagrams = useAppSelector(state => state.diagrams.diagrams);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [diagramToDelete, setDiagramToDelete] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filtrado de diagramas por búsqueda
    const filteredDiagrams = diagrams.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateDiagram = async (title: string, type: 'mental_map' | 'flow', description?: string) => {
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
            if (diagramToDelete === currentId) {
                navigate("/diagrams");
            }
            setDiagramToDelete(null);
        } catch (error) {
            console.error("Error deleting diagram", error);
        }
    };

    return {
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
    };
};
