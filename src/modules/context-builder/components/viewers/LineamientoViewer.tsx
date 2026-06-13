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
  </div>
);
