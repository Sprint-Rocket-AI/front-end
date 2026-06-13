import type { DocumentoLineamientoRequestInterface } from "../../interfaces/DocumentoLineamientoRequestInterface";

interface LineamientoViewerProps {
  data: DocumentoLineamientoRequestInterface;
}

export const LineamientoViewer = ({ data }: LineamientoViewerProps) => (
  <div className="space-y-4">
    {data.contenido && (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Directriz / Lineamiento</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
          {data.contenido}
        </p>
      </div>
    )}

    {data.tags && data.tags.length > 0 && (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Etiquetas</p>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}

    {(data.fechaCreacion || data.fechaActualizacion) && (
      <div className="flex flex-wrap items-center gap-4 pt-4 mt-6 text-xs text-slate-400 dark:text-slate-500">
        {data.fechaCreacion && (
          <div>Creado: {new Date(data.fechaCreacion).toLocaleString("es-CL")}</div>
        )}
        {data.fechaActualizacion && (
          <div>Actualizado: {new Date(data.fechaActualizacion).toLocaleString("es-CL")}</div>
        )}
      </div>
    )}
  </div>
);
