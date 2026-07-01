import { useRef, useCallback, useState, useEffect } from 'react';

export function useHistory<T>(current: T, setCurrent: (val: T) => void) {
    const past = useRef<T[]>([]);
    const future = useRef<T[]>([]);
    const currentRef = useRef(current);
    const [historyCounts, setHistoryCounts] = useState({ past: 0, future: 0 });

    useEffect(() => {
        currentRef.current = current;
    }, [current]);

    const push = useCallback((newState: T) => {
        past.current.push(currentRef.current);
        future.current = [];
        setHistoryCounts({ past: past.current.length, future: 0 });
        setCurrent(newState);
    }, [setCurrent]);

    const undo = useCallback(() => {
        if (!past.current.length) return;
        future.current.push(currentRef.current);
        const previousState = past.current.pop()!;
        setHistoryCounts({ past: past.current.length, future: future.current.length });
        setCurrent(previousState);
    }, [setCurrent]);

    const redo = useCallback(() => {
        if (!future.current.length) return;
        past.current.push(currentRef.current);
        const nextState = future.current.pop()!;
        setHistoryCounts({ past: past.current.length, future: future.current.length });
        setCurrent(nextState);
    }, [setCurrent]);

    return { 
        push, 
        undo, 
        redo, 
        canUndo: historyCounts.past > 0, 
        canRedo: historyCounts.future > 0 
    };
}