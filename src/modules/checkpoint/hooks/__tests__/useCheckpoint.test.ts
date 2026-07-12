import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheckpoint } from "../useCheckpoint";
import { checkpointService } from "../../../../services/CheckpointService";
import { getUserId } from "../../../auth/utils/authHelper";

// Mock the dependencies using paths relative to the test file
vi.mock("../../../../services/CheckpointService", () => ({
  checkpointService: {
    getActividadesByDesarrollador: vi.fn(),
    actualizarActividad: vi.fn(),
    getRecordatoriosByDesarrollador: vi.fn(),
    crearRecordatorio: vi.fn(),
    eliminarRecordatorio: vi.fn(),
    crearActividad: vi.fn(),
    actualizarActividadTitulo: vi.fn(),
    actualizarActividadDescripcion: vi.fn(),
    actualizarRecordatorioTitulo: vi.fn(),
    actualizarRecordatorioFecha: vi.fn(),
  },
}));

vi.mock("../../../auth/utils/authHelper", () => ({
  getUserId: vi.fn(),
}));

describe("useCheckpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUserId).mockReturnValue("user-123");
  });

  it("should initialize with default empty lists and loading states set to false", () => {
    const { result } = renderHook(() => useCheckpoint());

    expect(result.current.actividades).toEqual([]);
    expect(result.current.recordatorios).toEqual([]);
    expect(result.current.loadingActividades).toBe(false);
    expect(result.current.loadingRecordatorios).toBe(false);
  });

  it("should load activities successfully", async () => {
    const mockActividades = [
      { id: "act-1", titulo: "Hacer test", estado: "PENDIENTE" },
    ];
    vi.mocked(checkpointService.getActividadesByDesarrollador).mockResolvedValue(mockActividades as any);

    const { result } = renderHook(() => useCheckpoint());

    await act(async () => {
      await result.current.cargarActividades();
    });

    expect(getUserId).toHaveBeenCalled();
    expect(checkpointService.getActividadesByDesarrollador).toHaveBeenCalledWith("user-123");
    expect(result.current.actividades).toEqual(mockActividades);
    expect(result.current.loadingActividades).toBe(false);
  });

  it("should set error when loading activities fails", async () => {
    vi.mocked(checkpointService.getActividadesByDesarrollador).mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useCheckpoint());

    await act(async () => {
      await result.current.cargarActividades();
    });

    expect(result.current.actividades).toEqual([]);
    expect(result.current.loadingActividades).toBe(false);
    expect(result.current.error).toBe("No se pudieron cargar las actividades.");
  });

  it("should create a new activity and append it to the list", async () => {
    const mockNuevaActividad = { id: "act-2", titulo: "Refactorizar", estado: "PENDIENTE", userId: "user-123" };
    vi.mocked(checkpointService.crearActividad).mockResolvedValue(mockNuevaActividad as any);

    const { result } = renderHook(() => useCheckpoint());

    await act(async () => {
      await result.current.crearActividadDirecta({ titulo: "Refactorizar", estado: "PENDIENTE" } as any);
    });

    expect(checkpointService.crearActividad).toHaveBeenCalledWith({
      titulo: "Refactorizar",
      estado: "PENDIENTE",
      userId: "user-123",
    });
    expect(result.current.actividades).toContainEqual(mockNuevaActividad);
  });

  it("should update an activity's title", async () => {
    const mockUpdatedActividad = { id: "act-1", titulo: "Hacer test actualizado", estado: "PENDIENTE" };
    vi.mocked(checkpointService.actualizarActividadTitulo).mockResolvedValue(mockUpdatedActividad as any);

    const { result } = renderHook(() => useCheckpoint());

    // Setup initial activities list in state by mocking load
    vi.mocked(checkpointService.getActividadesByDesarrollador).mockResolvedValue([
      { id: "act-1", titulo: "Hacer test", estado: "PENDIENTE" },
    ] as any);
    await act(async () => {
      await result.current.cargarActividades();
    });

    await act(async () => {
      await result.current.actualizarActividadTitulo("act-1", "Hacer test actualizado");
    });

    expect(checkpointService.actualizarActividadTitulo).toHaveBeenCalledWith("act-1", "Hacer test actualizado");
    expect(result.current.actividades[0].titulo).toBe("Hacer test actualizado");
  });

  it("should load reminders successfully and sort them by date", async () => {
    const mockRecordatorios = [
      { id: "rem-2", titulo: "Review", proximoEnvio: "2026-07-15T12:00:00Z" },
      { id: "rem-1", titulo: "Daily", proximoEnvio: "2026-07-14T12:00:00Z" },
    ];
    vi.mocked(checkpointService.getRecordatoriosByDesarrollador).mockResolvedValue(mockRecordatorios as any);

    const { result } = renderHook(() => useCheckpoint());

    await act(async () => {
      await result.current.cargarRecordatorios();
    });

    expect(result.current.recordatorios).toEqual(mockRecordatorios); // Load keeps sorted as returned
  });

  it("should create a new reminder and insert it sorted by date", async () => {
    const initialReminders = [
      { id: "rem-2", titulo: "Late Task", proximoEnvio: "2026-07-16T12:00:00Z" },
    ];
    const mockNuevoRecordatorio = {
      id: "rem-1",
      titulo: "Early Task",
      proximoEnvio: "2026-07-14T12:00:00Z",
    };

    vi.mocked(checkpointService.getRecordatoriosByDesarrollador).mockResolvedValue(initialReminders as any);
    vi.mocked(checkpointService.crearRecordatorio).mockResolvedValue(mockNuevoRecordatorio as any);

    const { result } = renderHook(() => useCheckpoint());

    await act(async () => {
      await result.current.cargarRecordatorios();
    });

    await act(async () => {
      await result.current.nuevoRecordatorio({
        titulo: "Early Task",
        proximoEnvio: "2026-07-14T12:00:00Z",
      } as any);
    });

    expect(result.current.recordatorios).toHaveLength(2);
    // Early Task (rem-1) should be sorted first
    expect(result.current.recordatorios[0].id).toBe("rem-1");
    expect(result.current.recordatorios[1].id).toBe("rem-2");
  });

  it("should delete a reminder successfully from the list", async () => {
    const mockRecordatorios = [
      { id: "rem-1", titulo: "Daily", proximoEnvio: "2026-07-14T12:00:00Z" },
    ];
    vi.mocked(checkpointService.getRecordatoriosByDesarrollador).mockResolvedValue(mockRecordatorios as any);
    vi.mocked(checkpointService.eliminarRecordatorio).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useCheckpoint());

    await act(async () => {
      await result.current.cargarRecordatorios();
    });

    expect(result.current.recordatorios).toHaveLength(1);

    await act(async () => {
      await result.current.eliminarRecordatorio("rem-1");
    });

    expect(checkpointService.eliminarRecordatorio).toHaveBeenCalledWith("rem-1");
    expect(result.current.recordatorios).toHaveLength(0);
  });
});
