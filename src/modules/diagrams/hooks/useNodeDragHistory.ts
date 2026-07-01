import { useCallback, useRef } from 'react';
import type { Edge, Node } from '@xyflow/react';

type FlowSnapshot = {
    nodes: Node[];
    edges: Edge[];
};

type Params = {
    getSnapshot: () => FlowSnapshot;
    pushHistory: (snapshot: FlowSnapshot) => void;
};

export const useNodeDragHistory = ({ getSnapshot, pushHistory }: Params) => {
    const dragStartSnapshotRef = useRef<FlowSnapshot | null>(null);

    const onNodeDragStart = useCallback(() => {
        dragStartSnapshotRef.current = getSnapshot();
    }, [getSnapshot]);

    const onNodeDragStop = useCallback(() => {
        if (!dragStartSnapshotRef.current) return;

        pushHistory(dragStartSnapshotRef.current);
        dragStartSnapshotRef.current = null;
    }, [pushHistory]);

    return {
        onNodeDragStart,
        onNodeDragStop,
    };
};
