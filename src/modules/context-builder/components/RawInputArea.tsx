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
        className="field min-h-52"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pega aquí el texto bruto para que la IA construya un formulario estructurado..."
      />
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          checked={showStructuredForm}
          onChange={(event) => onToggleStructuredForm(event.target.checked)}
        />
        Ver estructura de formulario
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="action-secondary" onClick={onCreateManual} disabled={disabled}>
          Formulario manual
        </button>
        <button type="button" className="action-primary" onClick={() => void onGenerate()} disabled={disabled || isGenerating}>
          {isGenerating ? "Generando..." : "Generar formulario (AI)"}
        </button>
      </div>
    </div>
  </div>
);