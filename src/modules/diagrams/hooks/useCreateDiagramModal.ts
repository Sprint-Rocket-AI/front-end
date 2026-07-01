import { useState } from 'react';

interface UseCreateDiagramModalProps {
    onCreate: (title: string, type: 'mental_map' | 'flow', description: string) => void;
    onClose: () => void;
}

export const useCreateDiagramModal = ({ onCreate, onClose }: UseCreateDiagramModalProps) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'mental_map' | 'flow'>('flow');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onCreate(title.trim(), type, description.trim());
            setTitle('');
            setDescription('');
            onClose();
        }
    };

    return {
        title,
        setTitle,
        type,
        setType,
        description,
        setDescription,
        handleSubmit
    };
};
