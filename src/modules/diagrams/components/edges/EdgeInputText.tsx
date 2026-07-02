import { useCallback, useRef } from 'react';
import type { EdgeProps } from '@xyflow/react';
import { PlayIcon, PauseIcon } from '../../../../assets/Icons';
import {
    BaseEdge, EdgeLabelRenderer, EdgeToolbar,
    getBezierPath, getStraightPath, getSmoothStepPath,
    useReactFlow
} from '@xyflow/react';

const PATH_FN: Record<string, (p: any) => [string, number, number, ...number[]]> = {
    default: getBezierPath,
    straight: getStraightPath,
    step: (p) => getSmoothStepPath({ ...p, borderRadius: 0 }),
    smoothstep: (p) => getSmoothStepPath({ ...p, borderRadius: 10 }),
};

const LINE_TYPES = ['default', 'straight', 'step', 'smoothstep'];

export function EdgeInputText({
    id, sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    label, markerEnd, style, animated, selected, data
}: EdgeProps & { animated?: boolean }) {
    const { setEdges } = useReactFlow();
    const spanRef = useRef<HTMLSpanElement>(null);
    const isEditing = useRef(false);

    const lineType = (data?.lineType as string) ?? 'default';
    const [edgePath, labelX, labelY] = PATH_FN[lineType]({
        sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition
    });

    const update = useCallback((patch: object) =>
        setEdges((eds) => eds.map((e) => e.id === id ? { ...e, ...patch } : e))
        , [id, setEdges]);

    const enterEditMode = useCallback(() => {
        if (!spanRef.current || isEditing.current) return;
        isEditing.current = true;
        spanRef.current.contentEditable = 'true';
        spanRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(spanRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
    }, []);

    const exitEditMode = useCallback(() => {
        if (!spanRef.current) return;
        isEditing.current = false;
        spanRef.current.contentEditable = 'false';
        update({ label: spanRef.current.innerText.trim() });
    }, [update]);

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                className="nodrag nopan"
                style={{ pointerEvents: 'stroke', cursor: 'text' }}
                onDoubleClick={(e) => { e.stopPropagation(); enterEditMode(); }}
            />

            {selected && (
                <EdgeToolbar edgeId={id} x={labelX} y={labelY - 36}>
                    <div style={{ display: 'flex', gap: 4 }}>
                        <button
                            onClick={() => update({ animated: !animated })}
                            className={`flex items-center justify-center px-2 py-1 rounded border cursor-pointer transition ${
                                animated
                                    ? 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-800'
                                    : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                            }`}
                        >
                            {animated ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                        </button>

                        <div style={{ width: 1, background: '#b1b1b7' }} />

                        {LINE_TYPES.map((t) => (
                            <button key={t}
                                onClick={() => update({ data: { ...data, lineType: t } })}
                                style={{
                                    padding: '2px 8px', fontSize: 11, borderRadius: 4,
                                    border: '1px solid #b1b1b7',
                                    cursor: 'pointer', fontWeight: lineType === t ? 600 : 400
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </EdgeToolbar>
            )}

            <EdgeLabelRenderer>
                <span ref={spanRef} suppressContentEditableWarning
                    onDoubleClick={(e) => { e.stopPropagation(); enterEditMode(); }}
                    onBlur={exitEditMode}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); exitEditMode(); }
                        if (e.key === 'Escape') { isEditing.current = false; spanRef.current!.contentEditable = 'false'; }
                    }}
                    className="nodrag nopan"
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all', cursor: 'text',
                        border: label ? '1px solid #b1b1b7' : 'none',
                        borderRadius: 4, padding: label ? '2px 6px' : 0,
                        fontSize: 12, outline: 'none', minWidth: 40,
                        whiteSpace: 'pre-wrap', textAlign: 'center', userSelect: 'none',
                    }}
                >
                    {label ?? ''}
                </span>
            </EdgeLabelRenderer>
        </>
    );
}