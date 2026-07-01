import { Panel } from '@xyflow/react';
import { UndoIcon, RedoIcon } from '../../../../assets/Icons';

interface Props {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const DiagramHistoryPanel = ({ undo, redo, canUndo, canRedo }: Props) => {
    return (
        <Panel position="top-right">
            <div className="flex gap-2">
                <button 
                    onClick={undo} 
                    disabled={!canUndo}
                    className={`p-2 border rounded-lg shadow-sm transition ${
                        canUndo 
                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:text-orange-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-50'
                    }`}
                    title="Deshacer"
                >
                    <UndoIcon size={16} />
                </button>
                <button 
                    onClick={redo} 
                    disabled={!canRedo}
                    className={`p-2 border rounded-lg shadow-sm transition ${
                        canRedo 
                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:text-orange-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-50'
                    }`}
                    title="Rehacer"
                >
                    <RedoIcon size={16} />
                </button>
            </div>
        </Panel>
    );
};
