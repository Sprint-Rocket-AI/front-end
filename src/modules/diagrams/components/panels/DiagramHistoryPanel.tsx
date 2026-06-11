import { Panel } from '@xyflow/react';

interface Props {
    undo: () => void;
    redo: () => void;
}

export const DiagramHistoryPanel = ({ undo, redo }: Props) => {
    return (
        <Panel position="top-right">
            <div className="flex gap-2">
                <button onClick={undo} className="px-3 py-1 text-sm border rounded-md shadow">
                    ↩ Deshacer
                </button>
                <button onClick={redo} className="px-3 py-1 text-sm border rounded-md shadow">
                    ↪ Rehacer
                </button>
            </div>
        </Panel>
    );
};
