import { useState } from "react";
import { useAppDispatch } from "../../../commons/hooks/useAppDispatch";
import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";
import { mapWithAI } from "../../../services/AIService";
import { removeDocument, upsertDocument } from "../../../store/slices/documentsSlice";
import type { DocumentUnionType } from "../interfaces/DocumentUnionType";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";
import { createEmptyDocumentByType, createFallbackFromRawText, mergeAiResult } from "../templates/documentTemplates";
import { DocumentoContextService } from "../../../services/DocumentoContextService";
import { DocumentoDDLService } from "../../../services/DocumentoDDLService";
import { DocumentoLineamientoService } from "../../../services/DocumentoLineamientoService";
import { DocumentoNegocioService } from "../../../services/DocumentoNegocioService";
import { DocumentoSistemaService } from "../../../services/DocumentoSistemaService";
import type { DocumentoDDLRequestInterface } from "../interfaces/DocumentoDDLRequestInterface";
import type { DocumentoLineamientoRequestInterface } from "../interfaces/DocumentoLineamientoRequestInterface";
import type { DocumentoNegocioRequestInterface } from "../interfaces/DocumentoNegocioRequestInterface";
import type { DocumentoSistemaRequestInterface } from "../interfaces/DocumentoSistemaRequestInterface";

type EditableDocumentTipo = Exclude<DocumentTipoEnum, DocumentTipoEnum.PDF>;

const isEditableDocumentTipo = (tipo: DocumentTipoEnum | ""): tipo is EditableDocumentTipo =>
  tipo !== "" && tipo !== DocumentTipoEnum.PDF;

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
    setFormData(isEditableDocumentTipo(nextTipo) ? createEmptyDocumentByType(nextTipo) : null);
    setFeedback(nextTipo ? `Listo para modelar un documento ${nextTipo}.` : feedbackInitial);
  };

  const generateFromAI = async () => {
    if (!isEditableDocumentTipo(tipo)) {
      setFeedback("Selecciona un tipo de documento antes de generar un formulario estructurado.");
      return;
    }

    if (!rawText.trim()) {
      setFeedback("Pega el texto fuente antes de generar con IA.");
      return;
    }

    setIsGenerating(true);

    try {
      const template = createEmptyDocumentByType(tipo);
      const response = await mapWithAI(rawText, template);
      const nextData = mergeAiResult(tipo, response.data);
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
    if (!isEditableDocumentTipo(tipo)) {
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
    if (!isEditableDocumentTipo(tipo)) {
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

  const saveCurrentDocument = async (): Promise<boolean> => {
    if (!isEditableDocumentTipo(tipo) || !formData) {
      setFeedback("Genera o crea un formulario antes de guardar.");
      return false;
    }

    setIsGenerating(true);
    try {
      const isEdit = mode === "edit" && editingId;

      const { fechaCreacion, fechaActualizacion, ...payloadToSend } = formData;
      let responseData: DocumentUnionType;

      if (tipo === DocumentTipoEnum.DDL) {
        const payload = payloadToSend as DocumentoDDLRequestInterface;
        responseData = isEdit && editingId ? (await DocumentoDDLService.update(editingId, payload)).data : (await DocumentoDDLService.create(payload)).data;
      } else if (tipo === DocumentTipoEnum.NEGOCIO) {
        const payload = payloadToSend as DocumentoNegocioRequestInterface;
        responseData = isEdit && editingId ? (await DocumentoNegocioService.update(editingId, payload)).data : (await DocumentoNegocioService.create(payload)).data;
      } else if (tipo === DocumentTipoEnum.SISTEMA) {
        const payload = payloadToSend as DocumentoSistemaRequestInterface;
        responseData = isEdit && editingId ? (await DocumentoSistemaService.update(editingId, payload)).data : (await DocumentoSistemaService.create(payload)).data;
      } else {
        const payload = payloadToSend as DocumentoLineamientoRequestInterface;
        responseData = isEdit && editingId ? (await DocumentoLineamientoService.update(editingId, payload)).data : (await DocumentoLineamientoService.create(payload)).data;
      }

      const id = responseData.id || editingId || crypto.randomUUID();
      const nextData = {
        ...responseData,
        id,
        fechaCreacion: responseData.fechaCreacion,
      };

      dispatch(
        upsertDocument({
          id,
          tipo,
          data: nextData,
        }),
      );

      setFormData(nextData);
      setInitialState(nextData);
      setEditingId(id);
      setMode("edit");
      setFeedback(`Documento "${nextData.titulo || id}" guardado con éxito en el servidor.`);
      return true;
    } catch (error) {
      console.error(error);
      setFeedback("Error al guardar en el servidor.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const beginEdit = async (record: DocumentRecordInterface) => {
    setTipo(record.tipo);
    setMode("edit");
    setEditingId(record.id);
    setShowStructuredForm(true);
    setFeedback(`Cargando documento "${record.data.titulo || record.id}" desde el servidor...`);

    try {
      const response = await DocumentoContextService.getById(record.id);
      const serverData = response.data;
      setFormData(serverData);
      setInitialState(serverData);
      setRawText(serverData.contenido);
      setFeedback(`Editando ${serverData.titulo}.`);
    } catch (error) {
      console.error(error);
      setFormData(record.data);
      setInitialState(record.data);
      setRawText(record.data.contenido);
      setFeedback(`Editando ${record.data.titulo} (datos locales).`);
    }
  };

  const deleteById = async (id: string): Promise<boolean> => {
    try {
      const response = await DocumentoContextService.deleteById(id);
      const deleted = response.status === 204;

      if (!deleted) {
        setFeedback("No se pudo eliminar el documento.");
        return false;
      }

      dispatch(removeDocument(id));

      if (editingId === id) {
        setEditingId(null);
        setMode("create");
        setShowStructuredForm(false);
        setFormData(isEditableDocumentTipo(tipo) ? createEmptyDocumentByType(tipo) : null);
        setInitialState(null);
        setFeedback("Eliminación exitosa.");
        return true;
      }

      setFeedback("Eliminación exitosa.");
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      setFeedback("Error al eliminar el documento en el servidor.");
      return false;
    }
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