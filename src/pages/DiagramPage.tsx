import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DiagramBoard } from '../modules/diagrams/components/DiagramBoard';
import { useParams } from 'react-router-dom';

export const DiagramPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <ReactFlowProvider>
            <DiagramBoard />
        </ReactFlowProvider>
    );
};