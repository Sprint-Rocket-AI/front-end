import { useCallback, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

export function NodeInputText({ id, data }) {
    const spanRef = useRef(null);
    const isEditing = useRef(false);

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
        if (newLabel) data.onLabelChange(id, newLabel);
    }, [id, data]);

    return (
        <div
            onDoubleClick={(e) => { e.stopPropagation(); enterEditMode(); }}
            className="react-flow__node-default"
            style={{ width: 'max-content', minWidth: '80px', maxWidth: '250px' }}
        >
            <Handle type="target" position={Position.Top} />
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <Handle type="source" position={Position.Bottom} />

            <span
                ref={spanRef}
                suppressContentEditableWarning
                onBlur={exitEditMode}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        isEditing.current = false;
                        if (spanRef.current) spanRef.current.contentEditable = 'false';
                    }
                }}
                style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    outline: 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    userSelect: 'none',
                }}
            >
                {data.label}
            </span>
        </div>
    );
}