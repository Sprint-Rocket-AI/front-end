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
    createNewDraft,
    feedback,
    isGenerating,
    mode,
  } = useContextBuilder();

  return (
    <section className="space-y-6">
      <section className="panel overflow-hidden p-0">
        <div className="grid gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)] lg:px-8 lg:py-7">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
              Builder
            </span>
            <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-[2rem]">
              Editor estructurado para contexto documental.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-[15px]">
              Convierte texto libre en formularios editables, administra registros tipados y mantiene el flujo de trabajo claro en una interfaz simple y adaptable.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-4 sm:p-5 lg:grid-cols-1 lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">Registros</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{documents.length}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">registros listos para crear, editar y reorganizar.</p>
            </div>

            <div className="flex flex-col gap-2 sm:w-auto lg:w-full">
              <button type="button" className="action-primary w-full" onClick={createNewDraft}>
                Nuevo borrador
              </button>
              <div className="rounded-[1.5rem] border border-dashed border-slate-300/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Estado del editor</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Selecciona un tipo documental, genera estructura con IA o crea un borrador manual y edita el contenido desde el formulario tipado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-4xl">
          <div className="panel space-y-6">
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