import type { DocumentoDDLRequestInterface } from "../../interfaces/DocumentoDDLRequestInterface";

interface DDLViewerProps {
  data: DocumentoDDLRequestInterface;
}

export const DDLViewer = ({ data }: DDLViewerProps) => (
  <div className="space-y-6">
    <div className="flex gap-4 border-b border-slate-100 pb-3 dark:border-slate-800/50">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Motor BD</p>
        <span className="inline-block mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
          {data.motorBd || "No especificado"}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Versión</p>
        <span className="inline-block mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          v{data.version || "N/A"}
        </span>
      </div>
    </div>

    {data.tablas && data.tablas.length > 0 ? (
      <div className="space-y-6">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Estructura de Tablas</h4>
        {data.tablas.map((tabla, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200/50 pb-2 dark:border-slate-800/50">
              <h5 className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {tabla.esquema ? `${tabla.esquema}.` : ""}{tabla.nombre}
              </h5>
              {tabla.descripcion && (
                <p className="text-xs italic text-slate-500 dark:text-slate-400">{tabla.descripcion}</p>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs font-mono">
                <thead>
                  <tr className="text-left text-slate-400 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800/50">
                    <th className="pb-1 font-semibold">Columna</th>
                    <th className="pb-1 font-semibold">Tipo</th>
                    <th className="pb-1 font-semibold text-center">Atributos</th>
                    <th className="pb-1 font-semibold">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
                  {tabla.columnas?.map((col, colIdx) => (
                    <tr key={colIdx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30">
                      <td className="py-2 font-semibold">{col.nombre}</td>
                      <td className="py-2 text-slate-500">{col.tipoDato}</td>
                      <td className="py-2 text-center space-x-1 whitespace-nowrap">
                        {col.esPk && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">PK</span>
                        )}
                        {col.esFk && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">FK</span>
                        )}
                        {col.esUnique && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">UQ</span>
                        )}
                        {!col.esNullable && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">NN</span>
                        )}
                      </td>
                      <td className="py-2 text-slate-400 dark:text-slate-500 truncate max-w-xs">{col.descripcion || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-400">No hay tablas especificadas.</p>
    )}
  </div>
);
