import React, { useState } from 'react';
import { checkpointService } from '../../../services/CheckpointService';

interface FormatUtilsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormatUtilsModal: React.FC<FormatUtilsModalProps> = ({ isOpen, onClose }) => {
  const [columna, setColumna] = useState('');
  const [tipo, setTipo] = useState<'STRING' | 'INT'>('STRING');
  const [valoresText, setValoresText] = useState('');
  const [addIn, setAddIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!columna.trim()) {
      setError('Por favor, ingresa el nombre de la columna.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await checkpointService.formatIn({
        columna: columna.trim(),
        tipo,
        valores: valoresText,
        addIn,
      });
      setResult(response.statement);
    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error al formatear los valores.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-slate-200 animate-[fadeInUp_0.2s_ease]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Format Utils</h3>
            <p className="text-xs text-slate-500 mt-0.5">Construye sentencias SQL IN a partir de listas de datos</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Columna */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="tool-columna">
                Columna *
              </label>
              <input
                id="tool-columna"
                type="text"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                placeholder="Ej: POLICY_ID"
                value={columna}
                onChange={(e) => setColumna(e.target.value)}
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="tool-tipo">
                Tipo *
              </label>
              <select
                id="tool-tipo"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'STRING' | 'INT')}
              >
                <option value="STRING">STRING</option>
                <option value="INT">INT</option>
              </select>
            </div>
          </div>

          {/* addIn Checkbox/Toggle */}
          <div className="flex items-center gap-2.5 py-1">
            <input
              id="tool-addin"
              type="checkbox"
              checked={addIn}
              onChange={(e) => setAddIn(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-slate-800 bg-slate-900 text-orange-500 focus:ring-orange-500/20 cursor-pointer accent-orange-500"
            />
            <label htmlFor="tool-addin" className="text-xs font-semibold text-slate-400 select-none cursor-pointer">
              Incluir cláusula IN
            </label>
          </div>

          {/* Valores */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="tool-valores">
              Valores (uno por línea) *
            </label>
            <textarea
              id="tool-valores"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 resize-y min-h-28"
              placeholder="0-134095&#10;0-134104&#10;0-134119"
              value={valoresText}
              onChange={(e) => setValoresText(e.target.value)}
              required
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition shadow-md shadow-orange-500/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Procesando...
                </>
              ) : (
                'Formatear'
              )}
            </button>
          </div>
        </form>

        {/* Result Area */}
        {result && (
          <div className="mt-5 border-t border-slate-900 pt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resultado Formateado
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all cursor-pointer"
              >
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 text-xs font-mono text-emerald-400 outline-none min-h-20 resize-y"
              value={result}
            />
          </div>
        )}
      </div>
    </div>
  );
};
