import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DiagramBoard } from '../modules/diagrams/components/DiagramBoard';

export const DiagramPage = () => {
    return (
        <ReactFlowProvider>
            <DiagramBoard />
        </ReactFlowProvider>
    );
};