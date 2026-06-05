interface RawInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => Promise<void>;
  onCreateManual: () => void;
  showStructuredForm: boolean;
  onToggleStructuredForm: (value: boolean) => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const RawInputArea = ({
  value,
  onChange,
  onGenerate,
  onCreateManual,
  showStructuredForm,
  onToggleStructuredForm,
  isGenerating,
  disabled,
}: RawInputAreaProps) => (
  <div className="space-y-4">
    <div>
      <label className="label" htmlFor="raw-context">
        Texto de entrada
      </label>
      <textarea
        id="raw-context"
        className="field min-h-40 sm:min-h-52"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pega aquí el texto bruto para que la IA construya un formulario estructurado..."
      />
    </div>

    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:gap-3">
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:items-center">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 sm:mt-0"
          checked={showStructuredForm}
          onChange={(event) => onToggleStructuredForm(event.target.checked)}
        />
        Ver estructura de formulario
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" className="action-secondary w-full sm:w-auto" onClick={onCreateManual} disabled={disabled}>
          Formulario manual
        </button>
        <button
          type="button"
          className="action-primary w-full sm:w-auto"
          onClick={() => void onGenerate()}
          disabled={disabled || isGenerating}
        >
          {isGenerating ? "Generando..." : "Generar formulario (AI)"}
        </button>
      </div>
    </div>
  </div>
);