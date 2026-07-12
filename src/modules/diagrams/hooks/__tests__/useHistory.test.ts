import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory } from "../useHistory";

describe("useHistory", () => {
  it("should initialize with default states and disabled undo/redo", () => {
    const setCurrentMock = vi.fn();
    const { result } = renderHook(() => useHistory<string>("initial", setCurrentMock));

    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should support pushing a new state and updating history counts", () => {
    const setCurrentMock = vi.fn();
    const { result, rerender } = renderHook(
      ({ val }) => useHistory<string>(val, setCurrentMock),
      { initialProps: { val: "initial" } }
    );

    act(() => {
      result.current.push("second");
    });

    expect(setCurrentMock).toHaveBeenCalledWith("second");
    
    // Simulate current state change via prop update
    rerender({ val: "second" });
    
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should support record without changing current state", () => {
    const setCurrentMock = vi.fn();
    const { result } = renderHook(() => useHistory<string>("initial", setCurrentMock));

    act(() => {
      result.current.record("snapshot");
    });

    expect(setCurrentMock).not.toHaveBeenCalled();
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should support undo", () => {
    let currentVal = "initial";
    const setCurrentMock = vi.fn((val) => {
      currentVal = val;
    });

    const { result, rerender } = renderHook(
      ({ val }) => useHistory<string>(val, setCurrentMock),
      { initialProps: { val: currentVal } }
    );

    // Push new state
    act(() => {
      result.current.push("second");
    });
    rerender({ val: currentVal });

    expect(result.current.canUndo).toBe(true);

    // Undo
    act(() => {
      result.current.undo();
    });
    rerender({ val: currentVal });

    expect(setCurrentMock).toHaveBeenCalledWith("initial");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it("should support redo", () => {
    let currentVal = "initial";
    const setCurrentMock = vi.fn((val) => {
      currentVal = val;
    });

    const { result, rerender } = renderHook(
      ({ val }) => useHistory<string>(val, setCurrentMock),
      { initialProps: { val: currentVal } }
    );

    // Push new state
    act(() => {
      result.current.push("second");
    });
    rerender({ val: currentVal });

    // Undo
    act(() => {
      result.current.undo();
    });
    rerender({ val: currentVal });

    // Redo
    act(() => {
      result.current.redo();
    });
    rerender({ val: currentVal });

    expect(setCurrentMock).toHaveBeenLastCalledWith("second");
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should not undo if past is empty", () => {
    const setCurrentMock = vi.fn();
    const { result } = renderHook(() => useHistory<string>("initial", setCurrentMock));

    act(() => {
      result.current.undo();
    });

    expect(setCurrentMock).not.toHaveBeenCalled();
  });

  it("should not redo if future is empty", () => {
    const setCurrentMock = vi.fn();
    const { result } = renderHook(() => useHistory<string>("initial", setCurrentMock));

    act(() => {
      result.current.redo();
    });

    expect(setCurrentMock).not.toHaveBeenCalled();
  });
});
