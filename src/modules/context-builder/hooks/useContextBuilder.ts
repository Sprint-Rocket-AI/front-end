import { useState } from "react";
import { useAppDispatch } from "../../../commons/hooks/useAppDispatch";
import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";
import { mapWithAI } from "../../../services/DocumentService";
import { removeDocument, upsertDocument } from "../../../store/slices/documentsSlice";
import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import { createEmptyDocumentByType, createFallbackFromRawText, mergeAiResult } from "../templates/documentTemplates";

export const useContextBuilder = () => {
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
  const [feedback, setFeedback] = useState("Choose a type to begin building context.");

  const handleTypeChange = (nextTipo: DocumentTipoEnum | "") => {
    setTipo(nextTipo);
    setMode("create");
    setEditingId(null);
    setIsAI(false);
    setRawText("");
    setShowStructuredForm((prevValue) => (nextTipo ? prevValue : false));
    setInitialState(null);
    setFormData(nextTipo ? createEmptyDocumentByType(nextTipo) : null);
    setFeedback(nextTipo ? `Ready to model a ${nextTipo} document.` : "Choose a type to begin building context.");
  };

  const generateFromAI = async () => {
    if (!tipo) {
      setFeedback("Select a document type before generating a structured form.");
      return;
    }

    if (!rawText.trim()) {
      setFeedback("Paste source text before generating with AI.");
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
      setFeedback("Structured draft generated from AI payload.");
    } catch {
      const fallback = createFallbackFromRawText(tipo, rawText);
      setFormData(fallback);
      setInitialState(fallback);
      setShowStructuredForm(true);
      setIsAI(true);
      setFeedback("AI endpoint unavailable. A local structured draft was created instead.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startManualForm = () => {
    if (!tipo) {
      setFeedback("Select a document type before creating a manual draft.");
      return;
    }

    const nextData = createEmptyDocumentByType(tipo);
    setFormData(nextData);
    setInitialState(null);
    setShowStructuredForm(true);
    setIsAI(false);
    setMode("create");
    setEditingId(null);
    setFeedback(`Manual ${tipo} draft ready.`);
  };

  const reset = () => {
    if (!tipo) {
      return;
    }

    if (mode === "edit" && initialState) {
      setFormData(initialState);
      setFeedback("Form restored to the last saved version.");
      return;
    }

    if (isAI && initialState) {
      setFormData(initialState);
      setFeedback("Form restored to the AI structured draft.");
      return;
    }

    setFormData(createEmptyDocumentByType(tipo));
    setFeedback("Form cleared to an empty manual draft.");
  };

  const saveCurrentDocument = () => {
    if (!tipo || !formData) {
      setFeedback("Generate or create a structured form before saving.");
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
    setFeedback(`Document ${nextData.titulo || id} saved successfully.`);
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

  const createNewDraft = () => {
    setMode("create");
    setEditingId(null);
    setRawText("");
    setIsAI(false);
    setInitialState(null);
    setShowStructuredForm(false);
    setFormData(tipo ? createEmptyDocumentByType(tipo) : null);
    setFeedback("Create a fresh document draft.");
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
    createNewDraft,
    feedback,
    isGenerating,
    mode,
  };
};