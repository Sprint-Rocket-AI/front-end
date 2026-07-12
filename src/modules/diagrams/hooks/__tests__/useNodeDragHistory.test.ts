import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNodeDragHistory } from "../useNodeDragHistory";

describe("useNodeDragHistory", () => {
  it("should capture snapshot on drag start and push to history on drag stop", () => {
    const mockSnapshot = { nodes: [{ id: "n1", position: { x: 10, y: 20 } } as any], edges: [] };
    const getSnapshotMock = vi.fn().mockReturnValue(mockSnapshot);
    const pushHistoryMock = vi.fn();

    const { result } = renderHook(() =>
      useNodeDragHistory({
        getSnapshot: getSnapshotMock,
        pushHistory: pushHistoryMock,
      })
    );

    // Call onNodeDragStart
    act(() => {
      result.current.onNodeDragStart();
    });
    expect(getSnapshotMock).toHaveBeenCalledTimes(1);
    expect(pushHistoryMock).not.toHaveBeenCalled();

    // Call onNodeDragStop
    act(() => {
      result.current.onNodeDragStop();
    });
    expect(pushHistoryMock).toHaveBeenCalledWith(mockSnapshot);
  });

  it("should not push to history if onNodeDragStop is called without a prior onNodeDragStart", () => {
    const getSnapshotMock = vi.fn();
    const pushHistoryMock = vi.fn();

    const { result } = renderHook(() =>
      useNodeDragHistory({
        getSnapshot: getSnapshotMock,
        pushHistory: pushHistoryMock,
      })
    );

    act(() => {
      result.current.onNodeDragStop();
    });

    expect(getSnapshotMock).not.toHaveBeenCalled();
    expect(pushHistoryMock).not.toHaveBeenCalled();
  });
});
