import { useState, useEffect } from "react";
import { useAppSelector } from "../../../commons/hooks/useAppSelector";
import { useAppDispatch } from "../../../commons/hooks/useAppDispatch";
import { setDocuments } from "../../../store/slices/documentsSlice";
import { DocumentoContextService } from "../../../services/DocumentoContextService";
import type { DocumentRecordInterface } from "../../../commons/interfaces/DocumentRecordInterface";
import { ContextTypeSelector } from "../components/ContextTypeSelector";
import { DocumentTable } from "../components/DocumentTable";
import { DynamicFormRenderer } from "../components/DynamicFormRenderer";
import { RawInputArea } from "../components/RawInputArea";
import { useContextBuilder } from "../hooks/useContextBuilder";
import { Toast } from "../components/Toast";
import { DynamicDocumentViewer } from "../components/DynamicDocumentViewer";
import { ConfirmModal } from "../../../commons/components/ConfirmModal";
import { PdfUploader } from "../components/PdfUploader";
import { DocumentTipoEnum } from "../interfaces/DocumentTipoEnum";

export const ContextBuilderPage = () => {
  const documents = useAppSelector((state) => state.documents.items);
  const dispatch = useAppDispatch();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [viewingRecord, setViewingRecord] = useState<DocumentRecordInterface | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    tipo,
    setTipo,
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
  } = useContextBuilder();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await DocumentoContextService.getAll();
        const mappedDocuments = response.data.map((doc: any) => ({
          id: doc.id,
          tipo: doc.tipo,
          data: {
            ...doc,
            fechaCreacion: doc.fechaCreacion,
            fechaActualizacion: doc.fechaActualizacion,
          },
        }));
        dispatch(setDocuments(mappedDocuments));
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, [dispatch]);

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setToast({
        message: customEvent.detail || "Hubo un error, reintentar más tarde",
        type: "error",
      });
    };

    window.addEventListener("api-error", handleApiError);
    return () => {
      window.removeEventListener("api-error", handleApiError);
    };
  }, []);

  const handleSave = async () => {
    const success = await saveCurrentDocument();
    if (success) {
      setShowStructuredForm(false);
      const docTitle = formData?.titulo || "Documento sin título";
      setToast({
        message: `El documento "${docTitle}" ha sido guardado.`,
        type: "success",
      });
    }
  };

  return (
    <section className="space-y-6" style={{ width: '80%', margin: '0 auto' }}>
      <section className="space-y-6">
        <div className="w-full">
          <div className="panel space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Configuración</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">Context Builder</h2>
            </div>

            <ContextTypeSelector value={tipo} onChange={setTipo} />

            {tipo === DocumentTipoEnum.PDF ? (
              <PdfUploader
                onSuccess={(msg) => setToast({ message: msg, type: "success" })}
                onError={(msg) => setToast({ message: msg, type: "error" })}
              />
            ) : (
              <RawInputArea
                value={rawText}
                onChange={setRawText}
                onGenerate={generateFromAI}
                onCreateManual={startManualForm}
                isGenerating={isGenerating}
                disabled={!tipo}
              />
            )}

            <div className="rounded-2xl border border-orange-200/50 bg-orange-50 px-4 py-3 text-sm text-slate-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100">
              {feedback}
            </div>
          </div>
        </div>

        <DynamicFormRenderer
          tipo={tipo}
          data={formData}
          showStructuredForm={showStructuredForm}
          mode={mode}
          onClose={() => setShowStructuredForm(false)}
          onSave={handleSave}
          onReset={reset}
          canSave={Boolean(formData)}
          canReset={Boolean(tipo)}
          onChange={setFormData}
        />

        <DocumentTable
          documents={documents}
          onView={(record) => setViewingRecord(record)}
          onEdit={beginEdit}
          onDelete={(id) => setDeletingId(id)}
        />
      </section>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <DynamicDocumentViewer
        tipo={viewingRecord?.tipo ?? ""}
        data={viewingRecord?.data ?? null}
        isOpen={Boolean(viewingRecord)}
        onClose={() => setViewingRecord(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        onConfirm={async () => {
          if (deletingId) {
            const deleted = await deleteById(deletingId);
            setDeletingId(null);
            setToast({
              message: deleted ? "Eliminación exitosa." : "No se pudo eliminar el documento.",
              type: deleted ? "success" : "error",
            });
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  );
};