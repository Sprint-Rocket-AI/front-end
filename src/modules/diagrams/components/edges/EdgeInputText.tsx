import { useCallback, useRef } from 'react';
import type { EdgeProps } from '@xyflow/react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeToolbar,
    getBezierPath,
    useReactFlow
} from '@xyflow/react';

export function EdgeInputText({
    id, sourceX, sourceY, targetX, targetY,
    label, markerEnd, style, animated, selected
}: EdgeProps & { animated?: boolean }) {
    const { setEdges } = useReactFlow();
    const spanRef = useRef<HTMLSpanElement>(null);
    const isEditing = useRef(false);

    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

    const toggleAnimated = useCallback(() => {
        setEdges((eds) =>
            eds.map((e) => e.id === id ? { ...e, animated: !e.animated } : e)
        );
    }, [id, setEdges]);

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

            {/* Área invisible sobre el path para capturar doble clic cuando no hay label */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                className="nodrag nopan"
                style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                onDoubleClick={(e) => { e.stopPropagation(); enterEditMode(); }}
            />

            {selected && (
                <EdgeToolbar edgeId={id} x={labelX} y={labelY - 30}>
                    <button
                        onClick={toggleAnimated}
                        title={animated ? 'Desactivar animación' : 'Activar animación'}
                        style={{
                            padding: '2px 8px',
                            fontSize: 11,
                            borderRadius: 4,
                            border: '1px solid #b1b1b7',
                            background: animated ? '#dbeafe' : '#fff',
                            cursor: 'pointer',
                            fontWeight: animated ? 600 : 400,
                        }}
                    >
                        {animated ? '⏸ Animado' : '▶ Animar'}
                    </button>
                </EdgeToolbar>
            )}

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
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            exitEditMode();
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
                        minWidth: '40px',
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