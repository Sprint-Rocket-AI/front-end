import { useRef, useCallback } from 'react';

export function useHistory<T>(current: T, setCurrent: (val: T) => void) {
    const past = useRef<T[]>([]);
    const future = useRef<T[]>([]);

    const push = useCallback((newState: T) => {
        past.current.push(current);
        future.current = [];
        setCurrent(newState);
    }, [current, setCurrent]);

    const undo = useCallback(() => {
        if (!past.current.length) return;
        future.current.push(current);
        setCurrent(past.current.pop()!);
    }, [current, setCurrent]);

    const redo = useCallback(() => {
        if (!future.current.length) return;
        past.current.push(current);
        setCurrent(future.current.pop()!);
    }, [current, setCurrent]);

    return { push, undo, redo };
}