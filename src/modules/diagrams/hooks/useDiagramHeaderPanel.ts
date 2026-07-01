import { useState } from 'react';

interface UseDiagramHeaderPanelProps {
    title?: string;
    onRename?: (newTitle: string) => void;
}

export const useDiagramHeaderPanel = ({ title = '', onRename }: UseDiagramHeaderPanelProps) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [prevTitle, setPrevTitle] = useState(title);
    const [tempTitle, setTempTitle] = useState(title);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Sincronización del estado durante la renderización para evitar useEffect
    if (prevTitle !== title) {
        setPrevTitle(title);
        setTempTitle(title);
    }

    const handleSaveTitle = () => {
        const trimmed = tempTitle.trim();
        if (trimmed && trimmed !== title && onRename) {
            onRename(trimmed);
        }
        setIsEditingTitle(false);
    };

    return {
        isEditingTitle,
        setIsEditingTitle,
        tempTitle,
        setTempTitle,
        handleSaveTitle,
        isCollapsed,
        setIsCollapsed
    };
};
