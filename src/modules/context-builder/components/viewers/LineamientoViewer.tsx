import type { DocumentoLineamientoRequestInterface } from "../../interfaces/DocumentoLineamientoRequestInterface";

interface LineamientoViewerProps {
  data: DocumentoLineamientoRequestInterface;
}

export const LineamientoViewer = ({ data }: LineamientoViewerProps) => (
  <div className="space-y-4">
    {data.lineamiento && (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Directriz / Lineamiento</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
          {data.lineamiento}
        </p>
      </div>
    )}

    <div className="grid gap-4 sm:grid-cols-2">
      {data.dominio && data.dominio.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Dominios</p>
          <div className="flex flex-wrap gap-1.5">
            {data.dominio.map((dom, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs font-medium rounded bg-orange-500/10 text-orange-500">
                {dom}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.categoria && data.categoria.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Categorías</p>
          <div className="flex flex-wrap gap-1.5">
            {data.categoria.map((cat, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
