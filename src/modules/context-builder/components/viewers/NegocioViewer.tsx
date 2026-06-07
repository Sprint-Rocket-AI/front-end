import type { DocumentoNegocioRequestInterface } from "../../interfaces/DocumentoNegocioRequestInterface";

interface NegocioViewerProps {
  data: DocumentoNegocioRequestInterface;
}

export const NegocioViewer = ({ data }: NegocioViewerProps) => (
  <div className="space-y-4">
    {data.resumen && (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Resumen del Requerimiento</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
          {data.resumen}
        </p>
      </div>
    )}

    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fuente de Origen</p>
        <span className="inline-block mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
          {data.fuente || "OTRO"}
        </span>
      </div>
      {data.urlFuente && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Enlace de Referencia</p>
          <a
            href={data.urlFuente}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-xs font-medium text-blue-500 hover:underline truncate max-w-full"
          >
            {data.urlFuente}
          </a>
        </div>
      )}
    </div>

    {data.criteriosAceptacion && data.criteriosAceptacion.length > 0 && (
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Criterios de Aceptación</p>
        <ul className="space-y-2">
          {data.criteriosAceptacion.map((criterio, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 text-xs font-bold">✓</span>
              <span className="mt-0.5">{criterio}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
