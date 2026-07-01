import { Panel } from '@xyflow/react';
import { UndoIcon, RedoIcon } from '../../../../assets/Icons';

interface Props {
    undo: () => void;
    redo: () => void;
}

export const DiagramHistoryPanel = ({ undo, redo }: Props) => {
    return (
        <Panel position="top-right">
            <div className="flex gap-2">
                <button 
                    onClick={undo} 
                    className="p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:text-orange-500 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Deshacer"
                >
                    <UndoIcon size={16} />
                </button>
                <button 
                    onClick={redo} 
                    className="p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:text-orange-500 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Rehacer"
                >
                    <RedoIcon size={16} />
                </button>
            </div>
        </Panel>
    );
};
