import { useEffect, useRef, useState, useCallback } from "react";

interface AutoSaveProps {
  id: string | undefined;
  isDirty: boolean;
  onSave: () => Promise<void>;
  resetDirty: () => void;
  debounceMs?: number;
}

export const useAutoSave = ({
  id,
  isDirty,
  onSave,
  resetDirty,
  debounceMs = 3000,
}: AutoSaveProps) => {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  // Adjust state when id changes during render to avoid useEffect state triggers
  const [prevId, setPrevId] = useState<string | undefined>(id);
  if (prevId !== id) {
    setPrevId(id);
    setSaveStatus("idle");
  }

  const isDirtyRef = useRef(isDirty);
  const onSaveRef = useRef(onSave);
  const resetDirtyRef = useRef(resetDirty);
  
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    resetDirtyRef.current = resetDirty;
  }, [resetDirty]);

  const isSavingRef = useRef(false);
  const hasPendingChangesRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const triggerSave = useCallback(async () => {
    if (!id) return;

    // Avoid concurrent saves (race conditions)
    if (isSavingRef.current) {
      hasPendingChangesRef.current = true;
      return;
    }

    isSavingRef.current = true;
    setSaveStatus("saving");
    hasPendingChangesRef.current = false;

    try {
      await onSaveRef.current();
      setSaveStatus("saved");
      resetDirtyRef.current();
    } catch (error) {
      console.error("Auto-save error:", error);
      setSaveStatus("error");
    } finally {
      isSavingRef.current = false;
      // If new changes occurred while save was in progress, enqueue a new save
      if (hasPendingChangesRef.current && isDirtyRef.current) {
        triggerSave();
      }
    }
  }, [id]);

  useEffect(() => {
    // Only schedule if we have a valid ID and there are unsaved changes
    if (!isDirty || !id) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      triggerSave();
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDirty, id, debounceMs, triggerSave]);

  return { saveStatus, triggerSave };
};
