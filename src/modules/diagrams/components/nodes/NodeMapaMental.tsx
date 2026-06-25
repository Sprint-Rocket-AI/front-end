import { useCallback, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export function NodeMapaMental({ id, data }: any) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [, setIsEditing] = useState(false);

    const enterEditMode = useCallback(() => {
        setIsEditing(true);
        if (spanRef.current) {
            spanRef.current.contentEditable = 'true';
            spanRef.current.focus();

            const range = document.createRange();
            range.selectNodeContents(spanRef.current);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
        }
    }, []);

    const exitEditMode = useCallback(() => {
        setIsEditing(false);
        if (!spanRef.current) return;
        spanRef.current.contentEditable = 'false';
        const newLabel = spanRef.current.innerText.trim();
        if (newLabel && newLabel !== data.label) {
            data.onLabelChange?.(id, newLabel);
        } else {
            spanRef.current.innerText = data.label || '';
        }
    }, [id, data]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            exitEditMode();
        } else if (e.key === 'Escape') {
            if (spanRef.current) {
                spanRef.current.innerText = data.label || '';
            }
            exitEditMode();
        }
    }, [data.label, exitEditMode]);

    const handleStatusDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        let nextStatus: 'PENDIENTE' | 'EN PROCESO' | 'TERMINADO' = 'PENDIENTE';
        const current = (data.status || 'PENDIENTE').toUpperCase();
        
        if (current === 'PENDIENTE') {
            nextStatus = 'EN PROCESO';
        } else if (current === 'EN PROCESO') {
            nextStatus = 'TERMINADO';
        } else {
            nextStatus = 'PENDIENTE';
        }

        data.onStatusChange?.(id, nextStatus);
    }, [id, data]);

    const handleDeleteClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        data.onDeleteNode?.(id);
    }, [id, data]);

    const handleCollapseClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        data.onToggleCollapse?.(id);
    }, [id, data]);

    // Determine colors based on status
    const status = (data.status || 'PENDIENTE').toUpperCase();
    let borderClass = 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500';
    let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    
    if (status === 'EN PROCESO') {
        borderClass = 'border-orange-500 dark:border-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.15)]';
        badgeClass = 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/30';
    } else if (status === 'TERMINADO') {
        borderClass = 'border-green-500 dark:border-green-600 shadow-[0_0_10px_rgba(34,197,94,0.15)]';
        badgeClass = 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/30';
    }

    return (
        <div
            className={`relative group bg-white dark:bg-slate-900 border-2 rounded-xl p-4 shadow-sm min-w-[200px] max-w-[280px] flex flex-col gap-2 transition-all ${borderClass}`}
        >
            {/* Target and Source Handles */}
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900" />

            {/* Delete button (top right) */}
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                title="Eliminar nodo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Text label */}
            <div 
                className="pr-6 cursor-text"
                onDoubleClick={(e) => { e.stopPropagation(); enterEditMode(); }}
            >
                <span
                    ref={spanRef}
                    suppressContentEditableWarning
                    onBlur={exitEditMode}
                    onKeyDown={handleKeyDown}
                    className="block text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none select-text whitespace-pre-wrap break-words"
                >
                    {data.label}
                </span>
            </div>

            {/* Bottom row: status badge and collapse button */}
            <div className="flex items-center justify-between mt-1 select-none">
                <span
                    onDoubleClick={handleStatusDoubleClick}
                    className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded cursor-pointer select-none transition-colors uppercase ${badgeClass}`}
                    title="Doble clic para cambiar estado"
                >
                    {status}
                </span>

                {data.hasChildren && (
                    <button
                        onClick={handleCollapseClick}
                        className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold transition-all shadow-sm cursor-pointer"
                        title={data.collapsed ? "Expandir hijos" : "Colapsar hijos"}
                    >
                        {data.collapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
