import { useEffect, useState } from "react";
import { useAppSelector } from "../../../commons/hooks/useAppSelector";
import { ContextTypeSelector } from "../components/ContextTypeSelector";
import { DocumentTable } from "../components/DocumentTable";
import { DynamicFormRenderer } from "../components/DynamicFormRenderer";
import { RawInputArea } from "../components/RawInputArea";
import { useContextBuilder } from "../hooks/useContextBuilder";

export const ContextBuilderPage = () => {
  const documents = useAppSelector((state) => state.documents.items);
  const [isDark, setIsDark] = useState(true);
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="panel overflow-hidden p-0">
        <div className="grid gap-8 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.92))] px-6 py-8 text-white md:grid-cols-[1.6fr_0.9fr] md:px-8 md:py-10">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
              Context Builder
            </span>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              React 19 + Node 26.3 starter focused on structured project knowledge.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              Convierte texto libre en formularios editables, administra documentos tipados y deja lista una base modular con Vite, Tailwind, Redux Toolkit y Router.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-200">Workspace status</p>
              <p className="mt-3 text-3xl font-semibold">{documents.length}</p>
              <p className="text-sm text-slate-200">documents ready for create, edit and reset flows.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="action-primary" onClick={createNewDraft}>
                New Draft
              </button>
              <button type="button" className="action-secondary border-white/20 text-white hover:text-orange-200" onClick={() => setIsDark((value) => !value)}>
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="panel space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Builder Setup</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Context Builder</h2>
            </div>

            <ContextTypeSelector value={tipo} onChange={setTipo} />

            <RawInputArea
              value={rawText}
              onChange={setRawText}
              onGenerate={generateFromAI}
              onCreateManual={startManualForm}
              showStructuredForm={showStructuredForm}
              onToggleStructuredForm={setShowStructuredForm}
              isGenerating={isGenerating}
              disabled={!tipo}
            />

            <div className="rounded-2xl border border-orange-200/50 bg-orange-50 px-4 py-3 text-sm text-slate-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100">
              {feedback}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="action-primary" onClick={saveCurrentDocument} disabled={!formData}>
                Guardar
              </button>
              <button type="button" className="action-secondary" onClick={reset} disabled={!tipo}>
                Restablecer
              </button>
            </div>
          </div>

          <DocumentTable documents={documents} onEdit={beginEdit} onDelete={deleteById} />
        </div>

        <DynamicFormRenderer
          tipo={tipo}
          data={formData}
          showStructuredForm={showStructuredForm}
          mode={mode}
          onChange={setFormData}
        />
      </section>
    </main>
  );
};