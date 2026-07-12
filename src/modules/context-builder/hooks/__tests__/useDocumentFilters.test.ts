import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDocumentFilters } from "../useDocumentFilters";
import type { DocumentRecordInterface } from "../../../../commons/interfaces/DocumentRecordInterface";
import type { DocumentTipoEnum } from "../../interfaces/DocumentTipoEnum";

const mockDocuments: DocumentRecordInterface[] = [
  {
    id: "doc-1",
    tipo: "PDF" as DocumentTipoEnum,
    data: {
      titulo: "Manual de Usuario",
      proyectoId: "proj-alpha",
    },
  } as any,
  {
    id: "doc-2",
    tipo: "TXT" as DocumentTipoEnum,
    data: {
      titulo: "Notas de la reunión",
      proyectoId: "proj-beta",
    },
  } as any,
  {
    id: "doc-3",
    tipo: "PDF" as DocumentTipoEnum,
    data: {
      titulo: "Arquitectura del Sistema",
      proyectoId: "proj-alpha",
    },
  } as any,
];

describe("useDocumentFilters", () => {
  it("should return all documents by default when filters are empty", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedType).toBe("");
    expect(result.current.filteredDocuments).toEqual(mockDocuments);
  });

  it("should filter documents by selected type", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    act(() => {
      result.current.setSelectedType("TXT" as DocumentTipoEnum);
    });

    expect(result.current.filteredDocuments).toHaveLength(1);
    expect(result.current.filteredDocuments[0].id).toBe("doc-2");
  });

  it("should filter documents by search query matching title", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    act(() => {
      result.current.setSearchQuery("sistema");
    });

    expect(result.current.filteredDocuments).toHaveLength(1);
    expect(result.current.filteredDocuments[0].id).toBe("doc-3");
  });

  it("should filter documents by search query matching document ID", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    act(() => {
      result.current.setSearchQuery("doc-1");
    });

    expect(result.current.filteredDocuments).toHaveLength(1);
    expect(result.current.filteredDocuments[0].id).toBe("doc-1");
  });

  it("should filter documents by search query matching project ID", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    act(() => {
      result.current.setSearchQuery("proj-beta");
    });

    expect(result.current.filteredDocuments).toHaveLength(1);
    expect(result.current.filteredDocuments[0].id).toBe("doc-2");
  });

  it("should filter by both type and search query combined", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    act(() => {
      result.current.setSelectedType("PDF" as DocumentTipoEnum);
      result.current.setSearchQuery("Manual");
    });

    expect(result.current.filteredDocuments).toHaveLength(1);
    expect(result.current.filteredDocuments[0].id).toBe("doc-1");

    act(() => {
      // Manual exists but type TXT doesn't match
      result.current.setSelectedType("TXT" as DocumentTipoEnum);
    });
    expect(result.current.filteredDocuments).toHaveLength(0);
  });

  it("should handle empty or whitespace query gracefully", () => {
    const { result } = renderHook(() => useDocumentFilters(mockDocuments));

    act(() => {
      result.current.setSearchQuery("   ");
    });

    expect(result.current.filteredDocuments).toEqual(mockDocuments);
  });
});
