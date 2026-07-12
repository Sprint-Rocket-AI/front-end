import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutoSave } from "../useAutoSave";

describe("useAutoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with 'idle' status and not auto-save if not dirty", () => {
    const onSaveMock = vi.fn().mockResolvedValue(undefined);
    const resetDirtyMock = vi.fn();

    const { result } = renderHook(() =>
      useAutoSave({
        id: "diag-1",
        isDirty: false,
        onSave: onSaveMock,
        resetDirty: resetDirtyMock,
        debounceMs: 1000,
      })
    );

    expect(result.current.saveStatus).toBe("idle");
    
    vi.advanceTimersByTime(1000);
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it("should trigger auto-save after debounceMs when isDirty is true", async () => {
    const onSaveMock = vi.fn().mockResolvedValue(undefined);
    const resetDirtyMock = vi.fn();

    const { result } = renderHook(() =>
      useAutoSave({
        id: "diag-1",
        isDirty: true,
        onSave: onSaveMock,
        resetDirty: resetDirtyMock,
        debounceMs: 1000,
      })
    );

    // Should not save immediately
    expect(onSaveMock).not.toHaveBeenCalled();

    // Advance time just before debounce threshold
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onSaveMock).not.toHaveBeenCalled();

    // Advance past debounce threshold and await async actions
    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(onSaveMock).toHaveBeenCalledTimes(1);
    expect(resetDirtyMock).toHaveBeenCalledTimes(1);
    expect(result.current.saveStatus).toBe("saved");
  });

  it("should update state to idle when ID changes", async () => {
    const onSaveMock = vi.fn().mockResolvedValue(undefined);
    const resetDirtyMock = vi.fn();

    const { result, rerender } = renderHook(
      ({ id, isDirty }) =>
        useAutoSave({
          id,
          isDirty,
          onSave: onSaveMock,
          resetDirty: resetDirtyMock,
          debounceMs: 1000,
        }),
      { initialProps: { id: "diag-1", isDirty: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.saveStatus).toBe("saved");

    // Rerender with new ID
    act(() => {
      rerender({ id: "diag-2", isDirty: false });
    });
    expect(result.current.saveStatus).toBe("idle");
  });

  it("should handle error state if onSave rejects", async () => {
    const onSaveMock = vi.fn().mockRejectedValue(new Error("Network Error"));
    const resetDirtyMock = vi.fn();
    
    // Suppress console.error in tests
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useAutoSave({
        id: "diag-1",
        isDirty: true,
        onSave: onSaveMock,
        resetDirty: resetDirtyMock,
        debounceMs: 1000,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(onSaveMock).toHaveBeenCalled();
    expect(resetDirtyMock).not.toHaveBeenCalled();
    expect(result.current.saveStatus).toBe("error");

    consoleSpy.mockRestore();
  });

  it("should queue up another save if changes occur while save is in progress", async () => {
    let resolveSave: () => void = () => {};
    const onSavePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    const onSaveMock = vi.fn().mockReturnValue(onSavePromise);
    const resetDirtyMock = vi.fn();

    const { result, rerender } = renderHook(
      ({ id, isDirty }) =>
        useAutoSave({
          id,
          isDirty,
          onSave: onSaveMock,
          resetDirty: resetDirtyMock,
          debounceMs: 1000,
        }),
      { initialProps: { id: "diag-1", isDirty: true } }
    );

    // Trigger first save
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.saveStatus).toBe("saving");
    expect(onSaveMock).toHaveBeenCalledTimes(1);

    // Make dirty again during the save process
    act(() => {
      rerender({ id: "diag-1", isDirty: true });
    });

    // Try to trigger save again during active saving state
    act(() => {
      result.current.triggerSave();
    });

    // Resolve the first save and await the execution of the queued save
    await act(async () => {
      resolveSave();
    });

    // The status should update and triggerSave should be called again since there was a pending change.
    // The queued save will execute immediately since onSaveMock returns a resolved promise this time.
    expect(result.current.saveStatus).toBe("saved");
    expect(resetDirtyMock).toHaveBeenCalledTimes(2);
    expect(onSaveMock).toHaveBeenCalledTimes(2);
  });
});
