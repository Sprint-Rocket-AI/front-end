import { useState, useMemo } from "react";
import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";
import type { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";

export const useDocumentFilters = (documents: DocumentRecordInterface[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<DocumentTipoEnum | "">("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((record) => {
      const matchesType = !selectedType || record.tipo === selectedType;
      const query = searchQuery.toLowerCase().trim();

      if (!query) return matchesType;

      const matchesTitle = record.data.titulo?.toLowerCase().includes(query);
      const matchesId = record.id?.toLowerCase().includes(query);
      const matchesProjectId = record.data.proyectoId?.toLowerCase().includes(query);

      return matchesType && (matchesTitle || matchesId || matchesProjectId);
    });
  }, [documents, searchQuery, selectedType]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    filteredDocuments,
  };
};
