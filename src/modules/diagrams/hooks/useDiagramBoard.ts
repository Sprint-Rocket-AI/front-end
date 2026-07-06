import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../../store/store';
import { updateDiagramState } from '../../../store/slices/diagramsSlice';
import { diagramService, type Diagram } from '../../../services/DiagramService';
import type { Node, Edge } from '@xyflow/react';

interface ActiveFlowType {
    nodes: Node[];
    edges: Edge[];
    markdown?: string;
}

interface UseDiagramBoardProps {
    id: string | undefined;
}

export const useDiagramBoard = ({ id }: UseDiagramBoardProps) => {
    const dispatch = useAppDispatch();
    
    const [prevId, setPrevId] = useState(id);
    const [activeDiagram, setActiveDiagram] = useState<Diagram | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    // Sincronización de ID en renderizado
    if (prevId !== id) {
        setPrevId(id);
        setLoading(true);
        setActiveDiagram(null);
        setExpanded(false);
    }

    const handleSave = useCallback(async (activeFlow: ActiveFlowType, isMentalMap: boolean) => {
        if (!activeDiagram || !id) return;

        // Limpieza de propiedades visuales de los nodos
        const cleanNodes = activeFlow.nodes.map((n) => {
            const d = n.data as Record<string, unknown>;
            return {
                id: n.id,
                position: n.position,
                type: n.type,
                data: {
                    label: d.label,
                    status: d.status,
                    statusDetail: d.statusDetail,
                    collapsed: d.collapsed
                }
            };
        });

        // Limpieza de propiedades visuales de los enlaces
        const cleanEdges = activeFlow.edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type,
            animated: e.animated,
            label: e.label
        }));

        const payload: Partial<Diagram> = {
            title: activeDiagram.title,
            nodes: cleanNodes,
            edges: cleanEdges,
            markdown: isMentalMap ? activeFlow.markdown : undefined,
        };

        const updated = await diagramService.updateDiagram(id, payload);
        setActiveDiagram(updated);
        dispatch(updateDiagramState(updated));
    }, [id, activeDiagram, dispatch]);

    const handleRename = useCallback(async (newTitle: string) => {
        if (!activeDiagram || !id) return;
        setActiveDiagram(prev => prev ? { ...prev, title: newTitle } : null);
        try {
            const updated = await diagramService.updateDiagram(id, { title: newTitle });
            setActiveDiagram(updated);
            dispatch(updateDiagramState(updated));
        } catch (err) {
            console.error("Error renaming diagram:", err);
        }
    }, [id, activeDiagram, dispatch]);

    const handleUpdateDescription = useCallback(async (newDescription: string) => {
        if (!activeDiagram || !id) return;
        setActiveDiagram(prev => prev ? { ...prev, description: newDescription } : null);
        try {
            const updated = await diagramService.updateDiagram(id, { description: newDescription });
            setActiveDiagram(updated);
            dispatch(updateDiagramState(updated));
        } catch (err) {
            console.error("Error updating diagram description:", err);
        }
    }, [id, activeDiagram, dispatch]);

    const handleDownloadMd = (markdown: string) => {
        if (!activeDiagram) return;
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeDiagram.title || 'mapa_mental'}.md`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        activeDiagram,
        setActiveDiagram,
        loading,
        setLoading,
        expanded,
        setExpanded,
        handleSave,
        handleRename,
        handleUpdateDescription,
        handleDownloadMd,
        dispatch
    };
};
