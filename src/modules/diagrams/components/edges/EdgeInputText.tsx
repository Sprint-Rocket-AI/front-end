import { useCallback, useRef } from 'react';
import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from '@xyflow/react';

export function EdgeInputText({
    id, sourceX, sourceY, targetX, targetY,
    label, markerEnd, style
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const spanRef = useRef(null);
    const isEditing = useRef(false);

    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

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
        const newLabel = spanRef.current.innerText.trim();
        setEdges((eds) =>
            eds.map((e) => e.id === id ? { ...e, label: newLabel } : e)
        );
    }, [id, setEdges]);

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

            <EdgeLabelRenderer>
                <span
                    ref={spanRef}
                    suppressContentEditableWarning
                    onDoubleClick={(e) => { e.stopPropagation(); enterEditMode(); }}
                    onBlur={exitEditMode}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            isEditing.current = false;
                            if (spanRef.current) spanRef.current.contentEditable = 'false';
                        }
                    }}
                    className="nodrag nopan"
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                        background: label ? '#fff' : 'transparent',
                        border: label ? '1px solid #b1b1b7' : 'none',
                        borderRadius: 4,
                        padding: label ? '2px 6px' : 0,
                        fontSize: 12,
                        outline: 'none',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        minWidth: label ? '20px' : '40px', // área clickeable aunque esté vacío
                        cursor: 'default',
                        userSelect: 'none',
                    }}
                >
                    {label ?? ''}
                </span>
            </EdgeLabelRenderer>
        </>
    );
}