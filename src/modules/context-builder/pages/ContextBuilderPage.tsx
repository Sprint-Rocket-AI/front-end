import { useAppSelector } from "../../../commons/hooks/useAppSelector";
import { ContextTypeSelector } from "../components/ContextTypeSelector";
import { DocumentTable } from "../components/DocumentTable";
import { DynamicFormRenderer } from "../components/DynamicFormRenderer";
import { RawInputArea } from "../components/RawInputArea";
import { useContextBuilder } from "../hooks/useContextBuilder";

export const ContextBuilderPage = () => {
  const documents = useAppSelector((state) => state.documents.items);
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

  return (
    <section className="space-y-6">
      <section className="space-y-6">
        <div className="w-full">
          <div className="panel space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Configuración</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">Context Builder</h2>
            </div>

            <ContextTypeSelector value={tipo} onChange={setTipo} />

            <RawInputArea
              value={rawText}
              onChange={setRawText}
              onGenerate={generateFromAI}
              onCreateManual={startManualForm}
              isGenerating={isGenerating}
              disabled={!tipo}
            />

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
          onSave={saveCurrentDocument}
          onReset={reset}
          canSave={Boolean(formData)}
          canReset={Boolean(tipo)}
          onChange={setFormData}
        />

        <DocumentTable documents={documents} onEdit={beginEdit} onDelete={deleteById} />
      </section>
    </section>
  );
};