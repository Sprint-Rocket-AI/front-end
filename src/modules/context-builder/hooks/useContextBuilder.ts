import { useState } from "react";
import { useAppDispatch } from "../../../commons/hooks/useAppDispatch";
import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";
import { mapWithAI } from "../../../services/DocumentService";
import { removeDocument, upsertDocument } from "../../../store/slices/documentsSlice";
import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import { createEmptyDocumentByType, createFallbackFromRawText, mergeAiResult } from "../templates/documentTemplates";

export const useContextBuilder = () => {
  const feedbackInitial = "Selecciona un tipo de documento para comenzar a construir el contexto.";
  const dispatch = useAppDispatch();
  const [tipo, setTipo] = useState<DocumentTipoEnum | "">("");
  const [rawText, setRawText] = useState("");
  const [formData, setFormData] = useState<DocumentUnionType | null>(null);
  const [initialState, setInitialState] = useState<DocumentUnionType | null>(null);
  const [showStructuredForm, setShowStructuredForm] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState(feedbackInitial);
  const handleTypeChange = (nextTipo: DocumentTipoEnum | "") => {
    setTipo(nextTipo);
    setMode("create");
    setEditingId(null);
    setIsAI(false);
    setRawText("");
    setShowStructuredForm(false);
    setInitialState(null);
    setFormData(nextTipo ? createEmptyDocumentByType(nextTipo) : null);
    setFeedback(nextTipo ? `Listo para modelar un documento ${nextTipo}.` : feedbackInitial);
  };

  const generateFromAI = async () => {
    if (!tipo) {
      setFeedback("Selecciona un tipo de documento antes de generar un formulario estructurado.");
      return;
    }

    if (!rawText.trim()) {
      setFeedback("Pega el texto fuente antes de generar con IA.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await mapWithAI(rawText, tipo);
      const nextData = mergeAiResult(tipo, response.data.data);
      setFormData(nextData);
      setInitialState(nextData);
      setShowStructuredForm(true);
      setIsAI(true);
      setFeedback("Borrador estructurado generado a partir del payload de IA.");
    } catch {
      const fallback = createFallbackFromRawText(tipo, rawText);
      setFormData(fallback);
      setInitialState(fallback);
      setShowStructuredForm(true);
      setIsAI(true);
      setFeedback("Endpoint de IA no disponible. Se creó un borrador estructurado local en su lugar.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startManualForm = () => {
    if (!tipo) {
      setFeedback("Selecciona un tipo de documento antes de crear un borrador manual.");
      return;
    }

    const nextData = createEmptyDocumentByType(tipo);
    setFormData(nextData);
    setInitialState(null);
    setShowStructuredForm(true);
    setIsAI(false);
    setMode("create");
    setEditingId(null);
    setFeedback(`Borrador manual de ${tipo} listo.`);
  };

  const reset = () => {
    if (!tipo) {
      return;
    }

    if (mode === "edit" && initialState) {
      setFormData(initialState);
      setFeedback("Formulario restaurado a la última versión guardada.");
      return;
    }

    if (isAI && initialState) {
      setFormData(initialState);
      setFeedback("Formulario restaurado al borrador estructurado por IA.");
      return;
    }

    setFormData(createEmptyDocumentByType(tipo));
    setFeedback("Formulario vacío.");
  };

  const saveCurrentDocument = () => {
    if (!tipo || !formData) {
      setFeedback("Genera o crea un formulario antes de guardar.");
      return;
    }

    const timestamp = new Date().toISOString();
    const id = editingId ?? crypto.randomUUID();
    const nextData = {
      ...formData,
      id,
      createdAt: formData.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    dispatch(
      upsertDocument({
        id,
        tipo,
        origin: isAI ? "AI" : "MANUAL",
        data: nextData,
      }),
    );

    setFormData(nextData);
    setInitialState(nextData);
    setEditingId(id);
    setMode("edit");
    setFeedback(`Documento ${nextData.titulo || id} guardado con éxito.`);
  };

  const beginEdit = (record: DocumentRecordInterface) => {
    setTipo(record.tipo);
    setRawText(record.data.contenido);
    setFormData(record.data);
    setInitialState(record.data);
    setShowStructuredForm(true);
    setIsAI(record.origin === "AI");
    setMode("edit");
    setEditingId(record.id);
    setFeedback(`Editing ${record.data.titulo}.`);
  };

  const deleteById = (id: string) => {
    dispatch(removeDocument(id));

    if (editingId === id) {
      setEditingId(null);
      setMode("create");
      setShowStructuredForm(false);
      setFormData(tipo ? createEmptyDocumentByType(tipo) : null);
      setInitialState(null);
      setFeedback("Deleted document and cleared the active editor.");
      return;
    }

    setFeedback("Document deleted.");
  };


  return {
    tipo,
    setTipo: handleTypeChange,
    rawText,
    setRawText,
    formData,
    setFormData,
    showStructuredForm,
    setShowStructuredForm,
    generateFromAI,
    startManualForm,
    reset,
    saveCurrentDocument,
    beginEdit,
    deleteById,
    feedback,
    isGenerating,
    mode,
  };
};